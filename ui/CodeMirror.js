'use strict';

var React    = require('react');
var ReactDOM = require('react-dom');

var CodeMirrorR = React.createClass({
	render: function(){
		var self = this;
		return React.createElement(
			'textarea',
			{id: 'code', name: 'code', ref: function (_ref) {
				return self.editorEl = _ref;
			}},
			"-- SQL Mode for CodeMirror\nselect * from article;"
		);
		//return (<textarea id="code" name="code" ref={(ref) => this.editorEl = ref}>-- SQL Mode for CodeMirror
//select * from article;</textarea>);
	},
	componentDidMount: function () {

		var mime = 'text/x-mariadb';
		// get mime type
		if (window.location.href.indexOf('mime=') > -1) {
			mime = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
		}

		var hintOptions = window.hintOptions = {tables: {
			users: {name: null, score: null, birthDate: null},
			countries: {name: null, population: null, size: null}
		}};

		var EditorInstance = CodeMirror.fromTextArea(this.editorEl, {
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

		this.editor = EditorInstance;

		this.hintOptions = hintOptions;
	}
})

module.exports = CodeMirrorR
