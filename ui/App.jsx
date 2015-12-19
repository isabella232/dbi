'use strict'

var React = require ('react');
var ReactDOM = require ('react-dom');

var Navigator    = require('./Navigator');

var SQLEditor    = require('./SQLEditor');
var SchemaInspector    = require('./SchemaInspector');

import { Router, Route, Link, IndexRedirect } from 'react-router'

var history = require ('./history');

var unlisten = history.listen (location => {
	console.log ('LOCATION CHANGE > ', location.pathname)
})

var App = React.createClass ({
	render: function () {

		var DB = React.createClass ({
			render: function () {
				console.log ('DB prps:', this.props.params);
				return <div>{this.props.children}</div>
			}
		});

		return <Router history={history}>
			<Route path="/" component={Navigator}>
				<Route path=":database" component={DB}>
					<IndexRedirect to="sql" />
					<Route path="sql" component={SQLEditor} />
					<Route path="inspect" component={SchemaInspector} />
				</Route>
			</Route>
		</Router>

	}
});

module.exports = App

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render (
		React.createElement (App, null), document.querySelector ('div#grid')
	);
}, false);
