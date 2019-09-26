import React from "react";
import AuthService from "../util/AuthService";
import {NavLink} from "react-router-dom";
import TranslationService from "../util/TranslationService";
import IdeaService from "../util/IdeaService";
import {i18n} from "../index"
import {t} from "@lingui/macro"
import {Trans} from '@lingui/macro';


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
    console.log(i18n.language);
    i18n.activate('en');
    console.log(i18n.language);
  }

  changeLanguageToDe() {
    i18n.activate('de');
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
                  return <React.Fragment key={breadcrumb.target}>
                    <div className="header__breadcrumb-divider"/>
                    <NavLink activeClassName="header__nav-active" className="header__breadcrumb-link" to={breadcrumb.target} onCick={this.closeMobileMenu}>
                      {TranslationService.translate(breadcrumb.label)}
                    </NavLink>
                  </React.Fragment>
                })
              }

              <div className="header__breadcrumb-nav-divider"/>

              {
                this.state.localNavItems.map(localNavItem => {
                  return <React.Fragment key={localNavItem.target}>
                    <NavLink className="header__nav-link" to={localNavItem.target} onClick={this.closeMobileMenu}>
                      {TranslationService.translate(localNavItem.label)}
                    </NavLink>
                  </React.Fragment>
                })
              }


              {
                this.state.localNavItems.length > 0 ?
                  <div className="header__nav-divider"/>
                  : null
              }

              {/* END BREADCRUMB*/}

              <NavLink className="header__nav-link" to="/help" onClick={this.closeMobileMenu}><Trans id='NAV_LABEL_HELP'>Hilfe</Trans></NavLink>

              {
                !this.isUserLoggedIn() ?
                  <React.Fragment>
                    <NavLink className="header__nav-link" to="/signup" onClick={this.closeMobileMenu}><Trans id='NAV_LABEL_REGISTER'>Registieren</Trans></NavLink>
                    <NavLink className="header__nav-link" to="/login" onClick={this.closeMobileMenu}><Trans id='NAV_LABEL_LOGIN'>Login</Trans></NavLink>
                  </React.Fragment>
                  : null
              }
              {
                this.isUserLoggedIn() ?
                  <NavLink className="header__nav-link" to="/user-logout" onClick={this.closeMobileMenu}><Trans id='NAV_LABEL_LOGOUT'>Logout</Trans></NavLink>
                  : null
              }
              <div className="header__nav-divider"/>
              {
                i18n.language == 'de' ?
                  <a className="header__nav-link" onClick={this.changeLanguageToEn}><Trans id='NAV_LANG_ENGLISH'/></a>
                  : null
              }
              {
                i18n.language == 'en' ?
                  <a className="header__nav-link" onClick={this.changeLanguageToDe}><Trans id='NAV_LANG_GERMAN'/></a>
                  : null
              }
            </div>
          </nav>
        </div>
      </header>
    </div>);
  };
}
