'use strict';

var React    = require('react')

var RunButtons = React.createClass({
	propTypes: {
		connection: React.PropTypes.string,
		onChange:   React.PropTypes.func
	},
	//getDefaultProps: function() {
	//	return {
	//		value: ''
	//	};
	//},
	getInitialState: function() {
		return {selection: false, connected: false};
	},
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
			<button type="button" value="Run selection" disabled={!(this.state.selection & this.state.connected)} onClick={this.clickHandler} >
				Execute <kbd>ctrl</kbd> + <kbd>⏎</kbd>
			</button>
			<button type="button" value="Run all" disabled={!this.state.connected} onClick={this.clickHandler} >
				Execute All <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>⏎</kbd>
			</button>
		</div>
		);
	}
});

module.exports = RunButtons
