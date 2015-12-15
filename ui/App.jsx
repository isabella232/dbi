'use strict'

var React = require ('react');
var ReactDOM = require ('react-dom');

var ResultsTable = require('./ResultsTable');
var CodeMirror   = require('./CodeMirror');
var RunButtons   = require('./RunButtons');
var DBConnection = require('./DBConnection');
var TopMenu      = require('./TopMenu');

var ExpandableNav = require('react-expandable-nav');

// Or var ExpandableNavContainer = ExpandableNav.ExpandableNavContainer;
var {ExpandableNavContainer, ExpandableNavbar, ExpandableNavHeader,
	 ExpandableNavMenu, ExpandableNavMenuItem, ExpandableNavPage,
	 ExpandableNavToggleButton} = ExpandableNav;

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
			small: [<span className="glyphicon glyphicon-home">SQL</span>,
					<span className="glyphicon glyphicon-user">Schema</span>],
			full: [<span>SQL</span>, <span>Schema</span>,
					<span>Contact us</span>]
				   };

		var navStyles = {
			navbar: {smallWidth: 60, fullWidth: 240},
			page: {smallPadding: {padding: "0 0 0 60px"}}
		};

		return React.createElement ('div', {}, undefined, [
			<ExpandableNavContainer>
				<ExpandableNavbar fullWidth={navStyles.navbar.fullWidth} smallWidth={navStyles.navbar.smallWidth}>
					<ExpandableNavHeader small={<span className="logo">DBI</span>} full={<span>DBI</span>} />
					<ExpandableNavMenu>
						<ExpandableNavMenuItem small={menuItems.small[0]} full={menuItems.full[0]} url='/home/' />
						<ExpandableNavMenuItem small={menuItems.small[1]} full={menuItems.full[1]} url='/about/' />
					</ExpandableNavMenu>
				</ExpandableNavbar>
				<ExpandableNavToggleButton small={<span>open</span>} full={<span>close</span>}/>
				<ExpandableNavPage smallStyle={navStyles.page.smallPadding}>
					<div>
						<DBConnection ref="database" onChange={this.setConnection} onSchemaLoaded={this.setSchema}  key="db-connection" />
					</div>
					<CodeMirror ref="cm" onSelectionChange={this.setSelection} hintOptions={this.hintOptions} key="codemirror" />
					<RunButtons ref="buttons" onChange={this.clickHandler} key="action-toolbar" />
					<ResultsTable ref="grid" key="results-table" />
				</ExpandableNavPage>
			</ExpandableNavContainer>

//			React.createElement (TopMenu, {
//				key: "top-menu",
//				ref: "top-menu", // use string and this.refs like here: https://www.codementor.io/reactjs/tutorial/how-to-build-a-sliding-menu-using-react-js-and-less-css
//			}),

		]);
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
