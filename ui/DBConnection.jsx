'use strict';

var React  = require('react')
var Select = require('react-select');
// import Menu, {SubMenu, Item as MenuItem, Divider} from 'rc-menu';

var options = [
//	{ value: 'one', label: 'One' },
//	{ value: 'two', label: 'Two' }
];

function logChange(val) {
	console.log("Selected: " + val);
}

function handleSelect(info) {
	console.log(info);
	console.log('selected ' + info.key);
}

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
	emptyOpenKeys() {
		this.setState({
			openKeys: [],
		});
	},

	syncOpenKeys(e) {
		this.setState({
			openKeys: e.openKeys,
		});
	},
	render: function(){

		// onclick="runDBQuery(); return false;"

		var self = this;


		return React.createElement ('div', {}, undefined, [
			React.createElement (Select, {
				key: "connection-select",
				name: "form-field-name",
				value: this.state.value,
				clearable: false,
				searchable: false,
				style: {width: 300},
				options: this.state.options,
				onChange: this.setConnection,
				isLoading: this.state.loading,
				ref: function (_r) {self.select = _r}
			}),
			React.createElement ('button', {
				disabled: !this.state.schema,
				key: "schema-key",
				value: 'schema'
			})
			]);
	},
	setConnection: function (connName) {
		var xhr = new XMLHttpRequest();

		this.setState ({loading: true});

		xhr.open ("GET", "/connections/" + connName, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {

				var schema = JSON.parse (xhr.response);

				this.setState ({schema: true, loading: false, value: connName});

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
		var xhr = new XMLHttpRequest();

		var select = this.select;

		xhr.open ("GET", "/connections/list", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {

				var connections = JSON.parse (xhr.response);

				var first = true;

				var options = [],
					selected,
					value;

				for (var connName in connections) {
					if (first && !selected) {
						value = connName;
						// renderFlow ('.diagram', useCases.tests[useCaseName]);
					}
					first = false;
					options.push ({value: connName, label: connName});
					// selectEl.innerHTML += '<option value="' + connName + '">' + connName + '</option>';
				}

				this.setState ({loading: false, options: options, value: value});

				this.setConnection (value);

				// TODO: loadDBSchema (selectEl);

				// TODO: allow select
			}
		}.bind (this);

		xhr.send ();

	}
});

module.exports = DBConnections






