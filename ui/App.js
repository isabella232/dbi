'use strict'

var React = require ('react');
var ReactDOM = require ('react-dom');

var ResultsTable = require('./ResultsTable');
var CodeMirror   = require('./CodeMirror');
var RunButtons   = require('./RunButtons');
var DBConnection = require('./DBConnection');

function columnNames  (value) {return {name: value, title: value}}
function columnValues (value) {return value[1]}

var App = React.createClass ({
	runDBQuery: function (sql) {
		var xhr = new XMLHttpRequest();

		var grid = this.grid;

		grid.setState ({loading: true});

		xhr.open ("POST", "/connections/" + this.connection + "/run-query", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {

				var results = JSON.parse (xhr.response);

				//console.log (results);

				var columns = [],
					rows    = [],
					first   = true;

				results.forEach (function (row, idx) {
					if (first) {
						columns = Object.keys (row).map (columnNames);
						first = false;
					}
					rows.push (row);
				});

				grid.setState ({columns: columns, rows: rows, loading: false});

			}
		};

		var formData = new FormData();
		formData.append ("query", sql);
		xhr.send (formData);
	},
	clickHandler: function(value) {

		var sql;

		if (value === "Run selection") {
			sql = this.cm.editor.getSelection ();
		} else if (value === "Run all") {
			sql = this.cm.editor.getValue ();
		}

		// this is time to run some sql
		this.runDBQuery (sql);
	},
	setConnection: function (connection) {
		this.connection = connection;
		this.buttons.setState ({connected: connection ? true : false});
	},
	setSelection: function (selection) {
		if (this.cm.editor.somethingSelected ()) {
			this.buttons.setState ({selection: true});
		} else {
			this.buttons.setState ({selection: false});
		}
	},
	setSchema: function (tables) {
		this.hintOptions.tables = tables;
	},
	render: function () {

		this.hintOptions = {tables: {}};

		var self = this;

		return React.createElement ('div', {}, undefined, [
			React.createElement (DBConnection, {
				key: "db-connection",
				ref: function (_r) {self.database = _r},
				onChange: function (connection) {self.setConnection (connection);},
				onSchemaLoaded: this.setSchema
			}),
			React.createElement (CodeMirror, {
				key: "codemirror",
				ref: function (_r) {self.cm = _r},
				onSelectionChange: this.setSelection,
				hintOptions: this.hintOptions // no need to rerender component to update hintOptions
			}),
			React.createElement (RunButtons, {
				key: "action-toolbar",
				onChange: this.clickHandler, ref: function (_r) {self.buttons = _r}
			}),
			React.createElement (ResultsTable, {key: "results-table", ref: function (_r) {self.grid = _r}})
		]);
	},
	componentDidMount: function () {
		this.buttons.setState ({connected: false, selection: false});
	}
});

module.exports = App

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render (
		React.createElement (App, null), document.querySelector ('div#grid')
	);
}, false);
