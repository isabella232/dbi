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
			loading: false,
			error: null
		};
	},
	setData: function (state) {
		this.setState (state);
	},
	onSelectionChange: function (newSelection) {

		selection = newSelection;

		var clipInput = this.refs.clipboardSource;
		clipInput.value = JSON.stringify (newSelection);
		clipInput.select();
		clipInput.focus();

		this.setState ({});
	},
	render: function(){
		// , width: 2000
		return React.createElement('div', {}, undefined, [
			React.createElement('input', {
				readOnly: true,
				style: {position: 'absolute', zIndex: -1, top: -100, left: -100},
				ref: 'clipboardSource',
				key: 'clipboard-source'
			}),
			React.createElement(DataGrid, {
				idProperty: 'id',
				dataSource: this.state.rows,
				columns: this.state.columns,
				loading: this.state.loading,
				withColumnMenu: false,
				columnMinWidth: 100,
				style: { height: 300 },
				loadMaskOverHeader: true,
				emptyTextStyle: this.state.error ? {color: "red"} : {},
				emptyText: this.state.error ? this.state.error : 'No records',
				selected: selection,
				onSelectionChange: this.onSelectionChange,
				key: 'data-grid'
			})
		]);
	}
})

module.exports = ResultsTable
