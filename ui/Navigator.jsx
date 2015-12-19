var React = require ('react');

var ExpandableNav = require('react-expandable-nav');

var TopBar        = require('./TopBar');

// Or var ExpandableNavContainer = ExpandableNav.ExpandableNavContainer;
var {ExpandableNavContainer, ExpandableNavbar, ExpandableNavHeader,
	 ExpandableNavMenu, ExpandableNavMenuItem, ExpandableNavPage,
	 ExpandableNavToggleButton} = ExpandableNav;

var NavHeader = React.createClass ({
	propTypes: {
		small: React.PropTypes.element,
		full: React.PropTypes.element,
		headerStyle: React.PropTypes.object,
		smallStyle: React.PropTypes.object,
		fullStyle: React.PropTypes.object,
		smallClass: React.PropTypes.string,
		fullClass: React.PropTypes.string,
		onClick: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			headerStyle: {
				width: 100 + '%',
				margin: 0
			},
		};
	},
	render: function () {
		return <div className="expand-header-wrap" onClick={this.props.onClick}><ExpandableNavHeader
			headerStyle={this.props.headerStyle}
			small={this.props.small} full={this.props.full}
			smallStyle={this.props.smallStyle} fullStyle={this.props.fullStyle}
			smallClass={this.props.smallClass} fullClass={this.props.fullClass}
		/></div>
	}
});

function isLeftClickEvent(event) {
	return event.button === 0;
}

function isModifiedEvent(event) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

var NavLink = React.createClass ({
	onClick: function (event) {

		// ExpandableNav and Router/Link don't play nice

		var allowTransition = true;

		if (this.props.onClick) this.props.onClick(event);

		if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

		if (event.defaultPrevented === true) allowTransition = false;

		// If target prop is set (e.g. to "_blank") let browser handle link.
		if (this.props.target) {
			if (!allowTransition) event.preventDefault();

			return;
		}

		event.preventDefault();

		if (allowTransition) {
			this.props.history.pushState (null, this.props.menuItem.url);
		}

	},
	render: function () {
		return <ExpandableNavMenuItem
			small={this.props.menuItem.small}
			full={this.props.menuItem.full}
			url={this.props.menuItem.url}
			key={this.props.menuItem.url}
			onClick={this.onClick}
			onSelect={this.props.onSelect}
		/>
	}
});

var Navigation = React.createClass ({
	getInitialState: function() {
		return {expanded: false};
	},
	toggleExpand: function () {
		this.refs.navContainer.handleToggle ();
	},
	render: function () {

		this.hintOptions = {tables: {}};

		var self = this;

		var menuItems = {
			sql: {
				small: <span className="glyphicon glyphicon-home">SQL</span>,
				full: <span>SQL</span>,
				url: ['', this.props.params.database, 'sql'].join('/')
			},
			inspect: {
				small: <span className="glyphicon glyphicon-user">▦</span>,
				full: <span className="glyphicon glyphicon-user">Schema</span>,
				url: ['', this.props.params.database, 'inspect'].join('/')
			}
		};

		var navStyles = {
			navbar: {smallWidth: 60, fullWidth: 240},
			page: {smallPadding: {padding: "0 0 0 60px"}, fullPadding: {padding: "0 0 0 240px"}}
		};

		return <ExpandableNavContainer ref="navContainer">
			<ExpandableNavbar fullWidth={navStyles.navbar.fullWidth} smallWidth={navStyles.navbar.smallWidth}>
			<NavHeader onClick={this.toggleExpand} small={<span className="logo">☰</span>} full={<span>☰ Menu</span>} />
			<ExpandableNavMenu>
				<NavLink menuItem={menuItems.sql} history={this.props.history} />
				<NavLink menuItem={menuItems.inspect} history={this.props.history} />
			</ExpandableNavMenu>
			</ExpandableNavbar>
			<ExpandableNavPage smallStyle={navStyles.page.smallPadding} fullStyle={navStyles.page.fullPadding}>
				<TopBar ref="database" maxWidth="300" history={this.props.history} params={this.props.params} key="db-connection" />
				{this.props.children}
			</ExpandableNavPage>
			</ExpandableNavContainer>

	}
});

module.exports = Navigation;
