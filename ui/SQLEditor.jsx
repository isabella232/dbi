'use strict'

var React = require ('react');

var ResultsTable = require('./ResultsTable');

var CodeMirror   = require('./CodeMirror');
var RunButtons   = require('./RunButtons');

function columnNames  (value) {return {name: value, title: value}}
function columnValues (value) {return value[1]}

var SQLEditor = React.createClass ({
	runDBQuery: function (sql) {
		var xhr = new XMLHttpRequest();

		var grid = this.refs.grid;

		grid.setState ({loading: true});

		xhr.open ("POST", "/connections/" + this.props.params.database + "/run-query", true);
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

				grid.setData ({columns: columns, rows: rows, loading: false});

			}
		};

		var formData = new FormData();
		formData.append ("query", sql);
		xhr.send (formData);
	},
	clickHandler: function(value) {

		var sql;

		if (value === "Run selection") {
			sql = this.refs.cm.editor.getSelection ();
		} else if (value === "Run all") {
			sql = this.refs.cm.editor.getValue ();
		}

		// this is time to run some sql
		this.runDBQuery (sql);
	},
	setSelection: function (isSelected) {
		this.refs.buttons.setState ({selection: isSelected});
	},
	setSchema: function (schema) {

		var tables = {};

		for (var t in schema.tables) {
			tables[t] = schema.tables[t].columns;
		}

		this.hintOptions.tables = tables;
	},
	onEditorEvent: function (evt) {
		console.log (evt.type, evt.value);
		if (evt.type === "EXECUTE_SQL") {
			this.runDBQuery (evt.value);
		}
	},
	render: function () {

		this.hintOptions = {tables: {}};

		// TODO: add split control between codemirror and resultstable
		return <div>
			<CodeMirror ref="cm"
				onSelectionChange={this.setSelection}
				onEvent={this.onEditorEvent}
				hintOptions={this.hintOptions}
				key="cm"
			/>
			<RunButtons ref="buttons" onChange={this.clickHandler} key="rb" />
			<ResultsTable ref="grid" key="rt" />
		</div>
	},
	componentDidMount: function () {
		this.refs.buttons.setState ({connected: true, selection: false});
	}
});

module.exports = SQLEditor
