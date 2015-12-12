var ExcludedIntelliSenseTriggerKeys =
	{
		"8": "backspace",
		"9": "tab",
		"13": "enter",
		"16": "shift",
		"17": "ctrl",
		"18": "alt",
		"19": "pause",
		"20": "capslock",
		"27": "escape",
		"33": "pageup",
		"34": "pagedown",
		"35": "end",
		"36": "home",
		"37": "left",
		"38": "up",
		"39": "right",
		"40": "down",
		"45": "insert",
		"46": "delete",
		"91": "left window key",
		"92": "right window key",
		"93": "select",
		"107": "add",
		"109": "subtract",
		//"110": "decimal point",
		"111": "divide",
		"112": "f1",
		"113": "f2",
		"114": "f3",
		"115": "f4",
		"116": "f5",
		"117": "f6",
		"118": "f7",
		"119": "f8",
		"120": "f9",
		"121": "f10",
		"122": "f11",
		"123": "f12",
		"144": "numlock",
		"145": "scrolllock",
		"186": "semicolon",
		"187": "equalsign",
		//"188": "comma",
		"189": "dash",
		//"190": "period",
		"191": "slash",
		"192": "graveaccent",
		"220": "backslash",
		"222": "quote"
	}

function loadDBSchema (selectEl) {
	var xhr = new XMLHttpRequest();

	xhr.open ("GET", "/connections/" + selectEl.value, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {

			var schema = JSON.parse (xhr.response);

			var tables = {};

			for (var t in schema.tables) {
				tables[t] = schema.tables[t].columns;
			}

			hintOptions.tables = tables;
		}
	};

	xhr.send ();

}

function loadDBConnections (selectEl) {
	var xhr = new XMLHttpRequest();

	xhr.open ("GET", "/connections/list", true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {

			var connections = JSON.parse (xhr.response);

			selectEl.innerHTML = '';

			var first = true;

			for (var connName in connections) {
				if (first) {

					// renderFlow ('.diagram', useCases.tests[useCaseName]);
				}
				first = false;
				selectEl.innerHTML += '<option value="' + connName + '">' + connName + '</option>';
			}

			loadDBSchema (selectEl);

			// TODO: allow select
		}
	};

	xhr.send ();

}

function columnNames  (value) {return value[0]}
function columnValues (value) {return value[1]}

function runDBQuery () {
	var xhr = new XMLHttpRequest();

	var selectEl = document.querySelector ('select.db-select');
	var tableEl  = document.querySelector ('table#data');

	xhr.open ("POST", "/connections/" + selectEl.value + "/run-query", true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {

			var results = JSON.parse (xhr.response);

			console.log (results);

			tableEl.innerHTML = '';

			var first = true;

			results.forEach (function (row, idx) {
				var values = [];
				for (var k in row) {
					values.push ([k, row[k]]);
				}
				if (first) {
					tableEl.innerHTML += "<tr><td>" + values.map (columnNames).join ('</td><td>') + '</td></tr>';
					first = false;
				}
				tableEl.innerHTML += "<tr><td>" + values.map (columnValues).join ('</td><td>') + '</td></tr>';
			});
		}
	};

	editor.save();

	var sql = document.querySelector ("textarea#code").value;

	var formData = new FormData();

	formData.append ("query", sql);

	xhr.send (formData);

}


document.addEventListener ('DOMContentLoaded', function () {

	loadDBConnections (document.querySelector ('select.db-select'));

	/*
	var mime = 'text/x-mariadb';
	// get mime type
	if (window.location.href.indexOf('mime=') > -1) {
		mime = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
	}

	var hintOptions = window.hintOptions = {tables: {
		users: {name: null, score: null, birthDate: null},
		countries: {name: null, population: null, size: null}
	}};

	var EditorInstance = CodeMirror.fromTextArea(document.getElementById('code'), {
		mode: mime,
		// indentWithTabs: true,
		tabSize: 4,
		indentWithTabs: false,
		smartIndent: true,
		lineNumbers: true,
		matchBrackets : true,
		autofocus: true,
		extraKeys: {"Ctrl-Space": "autocomplete"},
		hintOptions: hintOptions
	});

	// taken from there: http://stackoverflow.com/questions/13744176/codemirror-autocomplete-after-any-keyup


	EditorInstance.on ("keyup", function(editor, event)
					  {
		var __Cursor = editor.getDoc().getCursor();
		var __Token = editor.getTokenAt(__Cursor);

		console.log (__Token.type, ['completion', __Token.type, 'active', editor.state.completionActive, 'token', __Token.string].join (', '));

		console.log ('intellisense code %s, state %s', (event.keyCode || event.which).toString(), ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()]);

		if (!editor.state.completionActive &&
			!ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()] &&
			(__Token.type === null || __Token.type === 'variable-2') && __Token.string.length > 0)
		{
			CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
		}
	});

	var tabs = 0;

	EditorInstance.on("change", function(cm, change) {

		if (change.origin != "paste" || change.text.length < 2) return;
		var spaces = tabs * cm.options.tabSize;
		cm.operation(function() {
			for (var line = change.from.line + 1, end = CodeMirror.changeEnd(change).line; line <= end; ++line)
				cm.indentLine(line, spaces);
		});
	});

	window.editor = EditorInstance;
	*/

	//Initialize cortex with data and pass in a callback to run when data is updated.
	// var orderCortex = new Cortex(orderData);

	//var orderComponent = React.renderComponent(
	//	<Order order={orderCortex} />, document.getElementById("order")
	//);

	//orderCortex.onUpdate(function(updatedOrder) {
	//	orderComponent.setProps({order: updatedOrder});
	//});

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
