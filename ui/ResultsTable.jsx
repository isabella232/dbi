'use strict';

var React    = require('react')
var DataGrid = require('react-datagrid')

var data = window.data     = []
var columns = [
	{ name: 'index', title: '#', width: 50 },
	{ name: 'firstName' },
	{ name: 'email' }
]

var selection = {};

var ResultsTable = React.createClass({
	getInitialState: function() {
		return {
			rows:    data,
			columns: columns,
			loading: false
		};
	},
	setData: function (state) {
		this.setState (state);
	},
	onSelectionChange: function (newSelection) {
		selection = newSelection;
		console.log (selection);
		this.setState ({});
	},
	render: function(){
		// , width: 2000
		return React.createElement('div', {}, undefined, [
			React.createElement('input', {
				style: {position: 'absolute', visibility: 'hidden'},
				ref: 'clipboardSource',
				key: 'clipboard-source'
			}),
			React.createElement(DataGrid, {
				idProperty: 'id',
				dataSource: this.state.rows,
				columns: this.state.columns,
				loading: this.state.loading,
				style: { height: 300 },
				loadMaskOverHeader: true,
				emptyText: 'No records',
				selection: selection,
				onSelectionChange: this.onSelectionChange,
				key: 'data-grid'
			})
		]);
	}
})

module.exports = ResultsTable
