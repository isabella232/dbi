var React = require ('react');

var ExpandableNav = require('react-expandable-nav');

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
				url: '/'
			},
			tables: {
				small: <span className="glyphicon glyphicon-user">▦</span>,
				full: <span className="glyphicon glyphicon-user">Schema</span>,
				url: '/tables'
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
			<ExpandableNavMenuItem small={menuItems.sql.small} full={menuItems.sql.full} url={menuItems.sql.url} key={menuItems.sql.url} />
			<ExpandableNavMenuItem small={menuItems.tables.small} full={menuItems.tables.full} url={menuItems.tables.url} key={menuItems.tables.url} />
			</ExpandableNavMenu>
			</ExpandableNavbar>
			<ExpandableNavPage smallStyle={navStyles.page.smallPadding} fullStyle={navStyles.page.fullPadding}>
			{this.props.children}
			</ExpandableNavPage>
			</ExpandableNavContainer>

	}
});

module.exports = Navigation;
