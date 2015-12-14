document.addEventListener ('DOMContentLoaded', function () {

}, false);

function getSelectedRange() {
	return {
		from: editor.getCursor(true),
		to: editor.getCursor(false)
	};
}

function autoFormatSelection() {
	var range = getSelectedRange();
	editor.autoFormatRange (range.from, range.to);
}

function indentAll () {
	var lineCount = editor.lineCount();
	for(var line = 0; line < lineCount; line++) {
		editor.indentLine(line, "smart");
	}
}

CodeMirror.extendMode("sql", {
	// FIXME semicolons inside of for
	newlineAfterToken: function(_type, content, textAfter, state) {
		console.log (_type, content, textAfter, state);
		if (_type === null && content === ',') return true;
		return false;
		/*if (this.jsonMode) {
			return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
		} else {
			if (content == ";" && state.lexical && state.lexical.type == ")") return false;
			return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
		}*/
	}
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
