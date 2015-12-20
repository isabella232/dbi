'use strict';

var React  = require('react')
var Select = require('react-select');
// import Menu, {SubMenu, Item as MenuItem, Divider} from 'rc-menu';

var options = [
//	{ value: 'one', label: 'One' },
//	{ value: 'two', label: 'Two' }
];

var DBConnections = React.createClass({
	propTypes: {
		// value:      React.PropTypes.array,
		onChange:   React.PropTypes.func,
		onSchemaLoaded:   React.PropTypes.func
	},
	//getDefaultProps: function() {
	//	return {
	//		value: ''
	//	};
	//},
	getInitialState: function() {
		return {
			options: options,
			loading: true,
			openKeys: [],
		};
	},
	render: function(){
		var self = this;

		var menuStyle = {
			display: 'inline-block',
			maxWidth: this.props.maxWidth,
			width: this.props.maxWidth,
			verticalAlign: 'middle'
		};

		// http://stackoverflow.com/questions/10272605/align-two-inline-blocks-left-and-right-on-same-line
		return <div className="header" style={ {background: "#3c3c3c", display: "flex", justifyContent: "space-between", padding: ".25em"} }>
			<h1 style={{margin: "0", color: "#b5b5b5"}}>DBI</h1>
			<div>
				<span style={{marginRight: "1em", color: "#b5b5b5"}}>Connections:</span>
				<div style={menuStyle}><Select
					key="connection-select"
					name="form-field-name"
					value={this.state.value}
					clearable={false}
					searchable={false}
					options={this.state.options}
					onChange={this.setConnection}
					isLoading={this.state.loading}
					ref="select" />
				</div>
			</div>
		</div>;

	},
	setConnection: function (connName) {
		var xhr = new XMLHttpRequest();

		this.setState ({loading: true});

		xhr.open ("GET", "/connections/" + connName, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {

				var schema = JSON.parse (xhr.response);

				this.setState ({schema: true, loading: false, value: connName});

				if (connName !== this.props.params.database)
					this.props.history.push ({
						pathname: connName
					});

				// TODO: use dispatcher
				window.hintOptions.tables = schema.tables;

				if (this.props.onSchemaLoaded)
					this.props.onSchemaLoaded (schema);
			}
		}.bind (this);

		xhr.send ();

		if (typeof this.props.onChange === 'function') {
			this.props.onChange(connName);
		}

	},
	componentDidMount: function () {

		console.log (this.props.history);

		var xhr = new XMLHttpRequest();

		var select = this.refs.select;

		xhr.open ("GET", "/connections/list", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {

				var connections = JSON.parse (xhr.response);

				var options = [],
					selected = this.props.params.database,
					value;

				for (var connName in connections) {
					if (selected && selected === connName) {
						value = connName;
						// renderFlow ('.diagram', useCases.tests[useCaseName]);
					}
					options.push ({value: connName, label: connName});
				}

				if (!value) {
					value = options[0].value;
				}

				this.setState ({loading: false, options: options, value: value});

				this.setConnection (value);

			}
		}.bind (this);

		xhr.send ();

	}
});

module.exports = DBConnections






