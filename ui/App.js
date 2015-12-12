'use strict'

var React = require ('react');
var ReactDOM = require ('react-dom');

var ResultsTable = require('./ResultsTable');
var CodeMirror   = require('./CodeMirror');
var RunButtons   = require('./RunButtons');

function columnNames  (value) {return {name: value, title: value}}
function columnValues (value) {return value[1]}

var App = React.createClass ({
	runDBQuery: function (sql) {
		var xhr = new XMLHttpRequest();

		var selectEl = document.querySelector ('select.db-select');

		var grid = this.grid;

		grid.setState ({loading: true});

		xhr.open ("POST", "/connections/" + selectEl.value + "/run-query", true);
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
	render: function () {

		var self = this;

		return React.createElement ('div', {}, undefined, [
			React.createElement (CodeMirror, {ref: function (_r) {self.cm = _r}}),
			React.createElement (RunButtons, {onChange: this.clickHandler, ref: function (_r) {self.buttons = _r}}),
			React.createElement (ResultsTable, {ref: function (_r) {self.grid = _r}})
		]);
	}
});

module.exports = App

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render (
		React.createElement (App, null), document.querySelector ('div#grid')
	);
}, false);
