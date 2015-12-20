document.addEventListener ('DOMContentLoaded', function () {

}, false);

function getSelectedRange() {
	return {
		from: cm.getCursor(true),
		to: cm.getCursor(false)
	};
}

function autoFormatSelection() {
	var range = getSelectedRange();
	cm.autoFormatRange (range.from, range.to);
}

function indentAll () {
	var lineCount = editor.lineCount();
	for(var line = 0; line < lineCount; line++) {
		cm.indentLine(line, "smart");
	}
}

CodeMirror.extendMode("sql", {
	// FIXME semicolons inside of for
	newlineAfterToken: function(_type, content, textAfter, state) {
		console.log (_type, content, (_type === null && content === ','), textAfter, state);
		if (_type === null && (content === ',')) return true;
		return false;
		/*if (this.jsonMode) {
			return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
		} else {
			if (content == ";" && state.lexical && state.lexical.type == ")") return false;
			return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
		}*/
	}
});

var QUERY_DIV = ';';
var Pos = CodeMirror.Pos;

function convertCurToNumber(cur) {
	// max characters of a line is 999,999.
	return cur.line + cur.ch / Math.pow(10, 6);
}

function convertNumberToCur(num) {
	return Pos(Math.floor(num), +num.toString().split('.').pop());
}

// Applies automatic formatting to the specified range
CodeMirror.defineExtension("currentSQLStatement", function () {
	var editor = this;

	var doc = editor.doc;
	var fullQuery = doc.getValue();
	var previousWord = "";
	var table = "";
	var separator = [];
	var validRange = {
		start: Pos(0, 0),
		end: Pos(editor.lastLine(), editor.getLineHandle(editor.lastLine()).length)
	};

	//add separator
	var indexOfSeparator = fullQuery.indexOf(QUERY_DIV);
	while(indexOfSeparator != -1) {
		separator.push(doc.posFromIndex(indexOfSeparator));
		indexOfSeparator = fullQuery.indexOf(QUERY_DIV, indexOfSeparator+1);
	}
	separator.unshift(Pos(0, 0));
	separator.push(Pos(editor.lastLine(), editor.getLineHandle(editor.lastLine()).text.length));

	//find valid range
	var prevItem = 0;
	var current = convertCurToNumber(editor.getCursor());
	for (var i=0; i< separator.length; i++) {
		var _v = convertCurToNumber(separator[i]);
		if (current > prevItem && current <= _v) {
			validRange = { start: convertNumberToCur(prevItem), end: convertNumberToCur(_v) };
			break;
		}
		prevItem = _v;
	}

	var query = doc.getRange(validRange.start, validRange.end, false);

	return query;
});

// Applies automatic formatting to the specified range
CodeMirror.defineExtension("autoFormatRange", function (from, to) {
	var cm = this;
	var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
	var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
	var tabSize = cm.getOption("tabSize");

	var out = "", lines = 0, atSol = from.ch == 0;
	function newline() {
		out += "\n";
		atSol = true;
		++lines;
	}

	for (var i = 0; i < text.length; ++i) {
		var stream = new CodeMirror.StringStream(text[i], tabSize);
		while (!stream.eol()) {
			var inner = CodeMirror.innerMode(outer, state);
			var style = outer.token(stream, state), cur = stream.current();
			stream.start = stream.pos;
			if (!atSol || /\S/.test(cur)) {
				out += cur;
				atSol = false;
			}
			if (!atSol && inner.mode.newlineAfterToken &&
				inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i+1] || "", inner.state))
				newline();
		}
		if (!stream.pos && outer.blankLine) outer.blankLine(state);
		if (!atSol && i < text.length - 1) newline();
	}

	cm.operation(function () {
		cm.replaceRange(out, from, to);
		for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
			cm.indentLine(cur, "smart");
		cm.setSelection(from, cm.getCursor(false));
	});
});
