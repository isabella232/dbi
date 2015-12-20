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
		// react render span elements within button tag
		var target = e.target.nodeName === 'button' ? e.target : e.target.parentNode;
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(target.value);
		}
	},
	render: function(){

		// onclick="runDBQuery(); return false;"

		return (
		<div>
			<button type="button" value={this.state.selection ? "selection" : "statement"} disabled={!this.state.connected} onClick={this.clickHandler} >
				Execute {this.state.selection ? "selection" : "statement"} <kbd>ctrl</kbd> + <kbd>⏎</kbd>
			</button>
			<button type="button" value="all" disabled={!this.state.connected} onClick={this.clickHandler} >
				Execute all <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>⏎</kbd>
			</button>
		</div>
		);
	}
});

module.exports = RunButtons
