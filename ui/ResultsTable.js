'use strict';

var React    = require('react')
var DataGrid = require('react-datagrid')

var data = window.data     = []
var columns = [
	{ name: 'index', title: '#', width: 50 },
	{ name: 'firstName' },
	{ name: 'email' }
]

var ResultsTable = React.createClass({
	getInitialState: function() {
		return {
			rows:    data,
			columns: columns,
			loading: false
		};
	},
	render: function(){
		// , width: 2000
		return React.createElement(DataGrid, {
			idProperty: 'id',
			dataSource: this.state.rows,
			columns: this.state.columns,
			loading: this.state.loading,
			style: { height: 300 },
			loadMaskOverHeader: true
		});
	}
})

module.exports = ResultsTable
