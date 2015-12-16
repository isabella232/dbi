'use strict'

var React = require ('react');
var ReactDOM = require ('react-dom');

var ResultsTable = require('./ResultsTable');
var CodeMirror   = require('./CodeMirror');
var RunButtons   = require('./RunButtons');
var DBConnection = require('./DBConnection');
var TopMenu      = require('./TopMenu');
var Navigation   = require('./Navigation');



function columnNames  (value) {return {name: value, title: value}}
function columnValues (value) {return value[1]}

var App = React.createClass ({
	runDBQuery: function (sql) {
		var xhr = new XMLHttpRequest();

		var grid = this.refs.grid;

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
	setConnection: function (connection) {
		this.connection = connection;
		this.refs.buttons.setState ({connected: connection ? true : false});
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
	render: function () {

		this.hintOptions = {tables: {}};

		var self = this;

		var menuItems = {
			sql: {
				small: <span className="glyphicon glyphicon-home">SQL</span>,
				full: <span>SQL</span>,
				url: '/'
			},
			tables: {
				small: <span className="glyphicon glyphicon-user">▦</span>,
				full: <span className="glyphicon glyphicon-user">Schema</span>,
				url: '/tables'
			}
	   };

		var navStyles = {
			navbar: {smallWidth: 60, fullWidth: 240},
			page: {smallPadding: {padding: "0 0 0 60px"}, fullPadding: {padding: "0 0 0 240px"}}
		};

		return <Navigation>
			<DBConnection ref="database" maxWidth="300" onChange={this.setConnection} onSchemaLoaded={this.setSchema}  key="db-connection" />
			<CodeMirror ref="cm" onSelectionChange={this.setSelection} hintOptions={this.hintOptions} key="codemirror" />
			<RunButtons ref="buttons" onChange={this.clickHandler} key="action-toolbar" />
			<ResultsTable ref="grid" key="results-table" />
		</Navigation>

	},
	componentDidMount: function () {
		this.refs.buttons.setState ({connected: false, selection: false});
	}
});

module.exports = App

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render (
		React.createElement (App, null), document.querySelector ('div#grid')
	);
}, false);
