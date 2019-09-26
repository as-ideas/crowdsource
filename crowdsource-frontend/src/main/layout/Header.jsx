import React from "react";
import AuthService from "../util/AuthService";
import {NavLink} from "react-router-dom";
import TranslationService from "../util/TranslationService";
import IdeaService from "../util/IdeaService";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobileMenuOpen: false,
            breadcrumbs: [],
            localNavItems: []
        };

        this.closeMobileMenu = this.closeMobileMenu.bind(this)
    }


    componentDidMount() {
        let currentRoute = this.props.location;
        this.state.breadcrumbs = this.getIdeasBreadcrumb(currentRoute)
    }

    getIdeasBreadcrumb(currentRoute) {
        var breadcrumbs = [];

        let currentCampaign = IdeaService.getCurrentCampaign();
        if (currentCampaign) {
            breadcrumbs.push({target: '/#/ideas/' + currentCampaign.id, label: currentCampaign.contentI18n[TranslationService.getCurrentLanguage()].title});
        }

        breadcrumbs.push({target: '/', label: "Übersicht"});
        return breadcrumbs;
    }

    isMobile() {
        // FIXME react
    }

    toggleMobileMenu() {
        this.setState({isMobileMenuOpen: !this.state.isMobileMenuOpen});
    }

    closeMobileMenu() {
        this.setState({isMobileMenuOpen: false});

    }

    isUserLoggedIn() {
        return AuthService.currentUser.loggedIn;
    }

    changeLanguageToEn() {
        TranslationService.changeLanguage('en');
    }

    changeLanguageToDe() {
        TranslationService.changeLanguage('de');
    }

    isCurrentLanguage(valueToBeChecked) {
        return TranslationService.isCurrentLanguage(valueToBeChecked);
    }

    render() {
        return (<div className="header__content-spacer">
            <header className="header__header-container">
                <div className="content-container">
                    <nav className="header__navigation">
                        <div className="header__header-mobile">
                            <NavLink className="header__home-link" to="/" ng-click="vm.closeMobileMenu()">
                                <div className="header__icon-crowdsource"/>
                            </NavLink>
                            <button className="header__burger-menu-button" ng-click="vm.toggleMobileMenu()"/>
                        </div>

                        <div className="header__breadcrumb-divider"/>
                        <div className="header__nav-container" ng-show="!vm.isMobile || (vm.isMobile && vm.isMobileMenuOpen)">

                            {
                                this.state.breadcrumbs.map(breadcrumb => {
                                    return <React.Fragment key={breadcrumb}>
                                        <div className="header__breadcrumb-divider"/>
                                        <a ng-class="{'header__nav-active':$last, 'header__breadcrumb-link':!$last}" ng-href="{{breadcrumb.target}}" ng-click="vm.closeMobileMenu()">{TranslationService.translate(breadcrumb)}</a>
                                    </React.Fragment>
                                })
                            }

                            <div className="header__breadcrumb-nav-divider"/>

                            {
                                this.state.localNavItems.map(localNavItem => {
                                    return <NavLink className="header__nav-link" to={localNavItem.target} onClick={this.closeMobileMenu}>
                                        {TranslationService.translate(localNavItem.label)}
                                    </NavLink>
                                })
                            }


                            {
                                this.state.localNavItems.length > 0 ?
                                    <div className="header__nav-divider"/>
                                    : null
                            }

                            {/* END BREADCRUMB*/}

                            <NavLink className="header__nav-link" to="/help" onClick={this.closeMobileMenu} translate="NAV_LABEL_HELP">Hilfe</NavLink>

                            {
                                !this.isUserLoggedIn() ?
                                    <React.Fragment>
                                        <NavLink className="header__nav-link" to="/signup" onClick={this.closeMobileMenu} translate="NAV_LABEL_REGISTER">Registieren</NavLink>
                                        <NavLink className="header__nav-link" to="/login" onClick={this.closeMobileMenu} translate="NAV_LABEL_LOGIN">Login</NavLink>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                this.isUserLoggedIn() ?
                                    <NavLink className="header__nav-link" to="/logout" onClick={this.closeMobileMenu} translate="NAV_LABEL_LOGOUT">Logout</NavLink>
                                    : null
                            }
                            <div className="header__nav-divider"/>
                            {
                                this.isCurrentLanguage('de') ?
                                    <a className="header__nav-link" onClick={this.changeLanguageToEn} translate="NAV_LANG_ENGLISH">English</a>
                                    : null
                            }
                            {
                                this.isCurrentLanguage('en') ?
                                    <a className="header__nav-link" onClick={this.changeLanguageToDe} translate="NAV_LANG_GERMAN">Deutsch</a>
                                    : null
                            }
                        </div>
                    </nav>
                </div>
            </header>
        </div>);
    };
}