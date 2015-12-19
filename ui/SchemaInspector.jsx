'use strict'

var React = require ('react');

var SchemaInspector = React.createClass ({
	render: function () {

		this.hintOptions = {tables: {}};

		// TODO: add split control between codemirror and resultstable
		return <div>
			Still nothing here, please move along!
		</div>
	},
	componentDidMount: function () {
		// this.refs.buttons.setState ({connected: true, selection: false});
	}
});

module.exports = SchemaInspector
