'use strict';

var React    = require('react');

var CodeMirrorR = React.createClass({
	propTypes: {
		onSelectionChange:   React.PropTypes.func,
		hintOptions:   React.PropTypes.object
	},
	render: function(){
		return <textarea id="code" name="code" ref="cm" defaultValue="select * from authors;" />
	},
	componentDidMount: function () {

		// TODO: read this.props.dialect
		//<code><a href="?mime=text/x-sql">text/x-sql</a></code>,
		//<code><a href="?mime=text/x-mysql">text/x-mysql</a></code>,
		//<code><a href="?mime=text/x-mariadb">text/x-mariadb</a></code>,
		//<code><a href="?mime=text/x-cassandra">text/x-cassandra</a></code>,
		//<code><a href="?mime=text/x-plsql">text/x-plsql</a></code>,
		//<code><a href="?mime=text/x-mssql">text/x-mssql</a></code>,
		//<code><a href="?mime=text/x-hive">text/x-hive</a></code>.

		var mime = 'text/x-mariadb';
		// get mime type
		if (window.location.href.indexOf('mime=') > -1) {
			mime = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
		}

		var hintOptions = window.hintOptions = this.props.hintOptions;
		var oldHintOptions = {tables: {
			users: {name: null, score: null, birthDate: null},
			countries: {name: null, population: null, size: null}
		}};

		var EditorInstance = CodeMirror.fromTextArea(this.refs.cm, {
			mode: mime,
			// indentWithTabs: true,
			tabSize: 4,
			indentWithTabs: false,
			smartIndent: true,
			lineNumbers: true,
			matchBrackets : true,
			autofocus: true,
			//theme: "zenburn",
			// extraKeys: {"Ctrl-Space": "autocomplete"},
			hintOptions: hintOptions
		});

		function getLineTokens () {
			// Retrieves information about the token the current mode found
			// before the given position (a {line, ch} object). The returned object
			// has the following properties:
			//  * start  – The character (on the given line) at which the token starts.
			//  * end    – The character at which the token ends.
			//  * string – The token's string.
			//  * type   – The token type the mode assigned to the token, such as "keyword" or "comment" (may also be null).
			//  * state  – The mode's state at the end of this token.
			// If precise is true, the token will be guaranteed to be accurate
			// based on recent edits. If false or not specified,
			// the token will use cached state information, which will be faster
			// but might not be accurate if edits were recently made and highlighting
			// has not yet completed.

			// cm.getTokenAt(pos: {line, ch}, ?precise: boolean) → object

			// This is similar to getTokenAt, but collects all tokens for a given line into an array.
			// It is much cheaper than repeatedly calling getTokenAt, which re-parses the part of the line
			// before the token for every call.

			// cm.getLineTokens(line: integer, ?precise: boolean) → array<{start, end, string, type, state}>

		}

		// taken from there: http://stackoverflow.com/questions/13744176/codemirror-autocomplete-after-any-keyup
		EditorInstance.on ("keyup", function(editor, event) {
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

		EditorInstance.on ("beforeSelectionChange", function (cm, obj) {
			//console.log (obj.ranges, obj.update(obj.ranges));

			var isSelected = false,
				range = obj.ranges[0];
			if ((range.anchor.line !== range.head.line) || (range.anchor.ch !== range.head.ch)) {
				isSelected = true;
			}

			if (this.props.onSelectionChange) {
				this.props.onSelectionChange (isSelected);
			}
		}.bind (this));

		this.editor = EditorInstance;

		this.hintOptions = hintOptions;
	}
})

module.exports = CodeMirrorR

var ExcludedIntelliSenseTriggerKeys = {
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
