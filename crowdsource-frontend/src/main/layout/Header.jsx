import React from "react";
import AuthService from "../util/AuthService";
import {NavLink, Route, useParams } from "react-router-dom";
import TranslationService from "../util/TranslationService";
import IdeaService from "../util/IdeaService";
import { Trans } from '@lingui/macro';
import {I18nContextConsumer} from "../contexts/I18nContext";
import {AuthContextConsumer} from "../contexts/AuthContext";


export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobileMenuOpen: false,
            breadcrumbs: [],
            localNavItems: [],
        }

        this.closeMobileMenu = this.closeMobileMenu.bind(this)
    }


    componentDidMount() {
        let currentRoute = this.props.location;
        // this.setState({ideasId: this.props.match.params.ideasId});
        this.state.breadcrumbs = this.getIdeasBreadcrumb(currentRoute)
    }

    getIdeasBreadcrumb(currentRoute) {
        var breadcrumbs = [];

        let currentCampaign = IdeaService.getCurrentCampaign();
        if (currentCampaign) {
            breadcrumbs.push({target: '/#/ideas/' + currentCampaign.id, label: currentCampaign.contentI18n[TranslationService.getCurrentLanguage()].title});
        }

        // TODO FIX: This currently breaks state update livecycle!
        // breadcrumbs.push({target: '/', label: "Übersicht"});
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


    render() {
        return (
          <I18nContextConsumer>
          { ({ language, i18n, switchLanguage }) => (
            <AuthContextConsumer>
              { ({ isLoggedIn, logout }) => (
              <div className="header__content-spacer">
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
                                            <a ng-class="{'header__nav-active':$last, 'header__breadcrumb-link':!$last}" ng-click="vm.closeMobileMenu()">{TranslationService.translate(breadcrumb)}</a>
                                        </React.Fragment>
                                    })
                                }

                                <div className="header__breadcrumb-nav-divider"/>

                                {/* END BREADCRUMB*/}

                                <Route path='/ideas/:ideasId' render={({ match }) => {
                                  return <NavLink className="header__nav-link" to={'/ideas/' + match.params.ideasId + '/own'} onClick={this.closeMobileMenu}>
                                    <Trans id="NAV_LABEL_IDEAS_OWN" />
                                  </NavLink>
                                }} />

                                <Route path='/ideas/:ideasId' render={({ match }) => {
                                  return <div className="header__nav-divider"/>
                                }} />

                                {/* END IDEAS SUB NAVIGATION*/}

                                <NavLink className="header__nav-link" to="/help" onClick={this.closeMobileMenu} ><Trans id='NAV_LABEL_HELP'>Hilfe</Trans></NavLink>

                                {
                                    !isLoggedIn ?
                                        <React.Fragment>
                                            <NavLink className="header__nav-link" to="/signup" onClick={this.closeMobileMenu} ><Trans id='NAV_LABEL_REGISTER'>Registrieren</Trans></NavLink>
                                            <NavLink className="header__nav-link" to="/login" onClick={this.closeMobileMenu} ><Trans id='NAV_LABEL_LOGIN'>Login</Trans></NavLink>
                                        </React.Fragment>
                                        :
                                        <NavLink className="header__nav-link" to="/user-logout" onClick={this.closeMobileMenu} ><Trans id='NAV_LABEL_LOGOUT'>Logout</Trans></NavLink>
                                }
                                <div className="header__nav-divider"/>
                                {
                                    language == 'de' ?
                                        <a className="header__nav-link" onClick={ () => switchLanguage('en') } ><Trans id='NAV_LANG_ENGLISH' /></a>
                                        : null
                                }
                                {
                                    language == 'en' ?
                                        <a className="header__nav-link" onClick={ () => switchLanguage('de') } ><Trans id='NAV_LANG_GERMAN' /></a>
                                        : null
                                }
                            </div>
                        </nav>
                    </div>
                </header>
            </div>
        )}
        </AuthContextConsumer>
      )}
      </I18nContextConsumer>);
    };

}
