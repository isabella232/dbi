'use strict';

var React    = require('react')

var RunButtons = React.createClass({
	propTypes: {
		// value:      React.PropTypes.array,
		onChange:   React.PropTypes.func
	},
	//getDefaultProps: function() {
	//	return {
	//		value: ''
	//	};
	//},
	clickHandler: function(e) {
		// console.log (e.target);
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(e.target.value);
		}
	},
	render: function(){

		// onclick="runDBQuery(); return false;"

		return (
		<div>
			<input type="button" value="Run selection" onClick={this.clickHandler} />
			<input type="button" value="Run all" onClick={this.clickHandler} />
		</div>
		);
	}
});

module.exports = RunButtons
