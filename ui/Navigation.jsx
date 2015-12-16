var React = require ('react');

var ExpandableNav = require('react-expandable-nav');

// Or var ExpandableNavContainer = ExpandableNav.ExpandableNavContainer;
var {ExpandableNavContainer, ExpandableNavbar, ExpandableNavHeader,
	 ExpandableNavMenu, ExpandableNavMenuItem, ExpandableNavPage,
	 ExpandableNavToggleButton} = ExpandableNav;

var Navigation = React.createClass ({

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

		return <ExpandableNavContainer>
			<ExpandableNavbar fullWidth={navStyles.navbar.fullWidth} smallWidth={navStyles.navbar.smallWidth}>
			<ExpandableNavHeader small={<span className="logo">DBI</span>} full={<span>DBI</span>} />
			<ExpandableNavMenu>
			<ExpandableNavMenuItem small={menuItems.sql.small} full={menuItems.sql.full} url={menuItems.sql.url} key={menuItems.sql.url} />
			<ExpandableNavMenuItem small={menuItems.tables.small} full={menuItems.tables.full} url={menuItems.tables.url} key={menuItems.tables.url} />
			</ExpandableNavMenu>
			</ExpandableNavbar>
			<ExpandableNavToggleButton small={<span>open</span>} full={<span>close</span>}/>
			<ExpandableNavPage smallStyle={navStyles.page.smallPadding} fullStyle={navStyles.page.fullPadding}>
			{this.props.children}
			</ExpandableNavPage>
			</ExpandableNavContainer>

	}
});

module.exports = Navigation;
