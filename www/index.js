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

// Maps a position in a case-folded line back to a position in the original line
// (compensating for codepoints increasing in number during folding)
function adjustPos(orig, folded, pos) {
	if (orig.length == folded.length) return pos;
	for (var pos1 = Math.min(pos, orig.length);;) {
		var len1 = orig.slice(0, pos1).toLowerCase().length;
		if (len1 < pos) ++pos1;
		else if (len1 > pos) --pos1;
		else return pos1;
	}
}

var QUERY_DIV = ';';
var Pos = CodeMirror.Pos;

function findMatch (doc, query, reverse, pos) {
	if (reverse) {
		var orig = doc.getLine(pos.line).slice(0, pos.ch), line = orig;
		var match = line.lastIndexOf(query);
		if (match > -1) {
			match = adjustPos(orig, line, match);
			return Pos(pos.line, match + query.length);
		}
	} else {
		var orig = doc.getLine(pos.line).slice(pos.ch), line = orig;
		var match = line.indexOf(query);
		if (match > -1) {
			match = adjustPos(orig, line, match) + pos.ch;
			return Pos(pos.line, match);
		}
	}
};

// Applies automatic formatting to the specified range
CodeMirror.defineExtension("currentSQLStatement", function () {
	var editor = this;

	var doc = editor.doc;
	var fullQuery = doc.getValue();

	var cursor = editor.getCursor();
	var query = ';';

	// search for a previous sql statement
	var start = Pos (0, 0),
		end   = Pos (editor.lastLine(), editor.getLineHandle(editor.lastLine()).length),
		pos   = cursor;

	for (;;) {
		var m = findMatch (doc, query, true, pos);
		if (m) {
			start = m;
			break;
		}
		if (!pos.line) break;
		pos = Pos(pos.line-1, this.doc.getLine(pos.line-1).length);
	}

	pos = cursor;
	for (;;) {
		var m = findMatch (doc, query, false, pos);
		if (m) {
			end = m;
			break;
		}
		var maxLine = this.doc.lineCount();
		if (pos.line == maxLine - 1) break;
		pos = Pos(pos.line + 1, 0);
	}

	return doc.getRange (start, end, false).join ("\n")

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
