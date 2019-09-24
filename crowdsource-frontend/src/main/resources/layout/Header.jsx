import React from "react";

export default class Header extends React.Component {

    closeMobileMenu() {

    }

    isUserLoggedIn() {
        // FIXME react vm.auth.currentUser.loggedIn
        return true;
    }

    localNavItemLabel() {
        return "localNavItemLabel"
    }

    breadcrumbLabel() {
        return "breadcrumbLabel";
    }

    changeLanguage(newValue) {
        // FIXME react vm.changeLanguage('en')
    }

    isCurrentLanguage(valueToBeChecked) {
        // FIXME vm.currentLanguage=='de'
        return true;
    }

    render() {
        return (<div className="header__content-spacer">
            <header className="header__header-container">
                <div className="content-container">
                    <nav className="header__navigation">
                        <div className="header__header-mobile">
                            <a className="header__home-link" href="#" ng-click="vm.closeMobileMenu()">
                                <div className="header__icon-crowdsource"/>
                            </a>
                            <button className="header__burger-menu-button" ng-click="vm.toggleMobileMenu()"/>
                        </div>
                        <div className="header__nav-container" ng-show="!vm.isMobile || (vm.isMobile && vm.isMobileMenuOpen)">
                            <div ng-repeat-start="breadcrumb in vm.breadcrumbs" className="header__breadcrumb-divider"/>
                            <a ng-repeat-end="" ng-class="{'header__nav-active':$last, 'header__breadcrumb-link':!$last}" ng-href="{{breadcrumb.target}}" onClick={this.closeMobileMenu}>{
                                this.breadcrumbLabel()}
                            </a>
                            <div className="header__breadcrumb-nav-divider"/>
                            <a ng-repeat="localNavItem in vm.localNavItems" className="header__nav-link" ng-href="{{localNavItem.target}}" ng-click="this.closeMobileMenu()">{this.localNavItemLabel()}</a>
                            <div ng-if="vm.localNavItems.length > 0" className="header__nav-divider"></div>
                            <a className="header__nav-link" href="#/help" ng-click="vm.closeMobileMenu()" translate="NAV_LABEL_HELP">Hilfe</a>

                            {
                                !this.isUserLoggedIn() ?
                                    <React.Fragment>
                                        <a className="header__nav-link" href="#/signup" onClick={this.closeMobileMenu} translate="NAV_LABEL_REGISTER">Registieren</a>
                                        <a className="header__nav-link" href="#/login" onClick={this.closeMobileMenu} translate="NAV_LABEL_LOGIN">Login</a>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                this.isUserLoggedIn() ?
                                    <a ng-if="vm.auth.currentUser.loggedIn" className="header__nav-link" href="#/logout" ng-click="vm.closeMobileMenu()" translate="NAV_LABEL_LOGOUT">Logout</a>
                                    : null
                            }
                            <div className="header__nav-divider"/>
                            {
                                this.isCurrentLanguage('de') ?
                                    <a className="header__nav-link" ng-click="vm.changeLanguage('en')" translate="NAV_LANG_ENGLISH">English</a>
                                    : null
                            }
                            {
                                this.isCurrentLanguage('en') ?
                                    <a className="header__nav-link" ng-click="vm.changeLanguage('de')" translate="NAV_LANG_GERMAN">Deutsch</a>
                                    : null
                            }
                        </div>
                    </nav>
                </div>
            </header>
        </div>);
    };
}