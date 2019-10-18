import React from "react";
import {NavLink, Route} from "react-router-dom";
import TranslationService from "../util/TranslationService";
import IdeaService from "../util/IdeaService";
import {Trans} from '@lingui/macro';
import {I18nContextConsumer} from "../contexts/I18nContext";
import {AuthContextConsumer} from "../contexts/AuthContext";
import {NavContextConsumer} from "../contexts/NavContext";


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

  isMobile() {
    // FIXME react
  }

  toggleMobileMenu() {
    this.setState({isMobileMenuOpen: !this.state.isMobileMenuOpen});
  }

  closeMobileMenu() {
    this.setState({isMobileMenuOpen: false});

  }


  render() {
    return (
      <I18nContextConsumer>
        {({language, i18n, switchLanguage}) => (
          <AuthContextConsumer>
            {({isLoggedIn, isAdmin}) => (
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
                      <div className="header__nav-container"
                           ng-show="!vm.isMobile || (vm.isMobile && vm.isMobileMenuOpen)">
                        <NavContextConsumer>
                          {({breadcrumb, pageTitle}) => (
                            <React.Fragment>
                              {
                                breadcrumb ? breadcrumb.map(function (item, i) {
                                    return <React.Fragment key={i}>
                                      <NavLink className="header__breadcrumb-link" to={item.url}>{item.title}</NavLink>
                                      <div className="header__breadcrumb-divider"/>
                                    </React.Fragment>
                                  })
                                  : null
                              }
                              <a className="header__nav-active">{pageTitle}</a>
                            </React.Fragment>
                          )}
                        </NavContextConsumer>

                        <div className="header__breadcrumb-nav-divider"/>

                        {/* END BREADCRUMB*/}

                        <Route path='/ideas/:ideasId' render={({match}) => {
                          return <React.Fragment>
                            <NavLink className="header__nav-link" to={'/ideas/' + match.params.ideasId + '/own'}
                                     onClick={this.closeMobileMenu}>
                              <Trans id="NAV_LABEL_IDEAS_OWN"/>
                            </NavLink>
                            {
                              isAdmin ?
                                <NavLink className="header__nav-link" to={'/ideas/' + match.params.ideasId + '/admin'}
                                         onClick={this.closeMobileMenu}>
                                  <Trans id="NAV_LABEL_ADMIN"/>
                                </NavLink>
                                : null
                            }
                            <div className="header__nav-divider"/>
                          </React.Fragment>
                        }}/>

                        {/* END IDEAS SUB NAVIGATION*/}

                        <NavLink className="header__nav-link" to="/help" onClick={this.closeMobileMenu}><Trans
                          id='NAV_LABEL_HELP'>Hilfe</Trans></NavLink>

                        {
                          !isLoggedIn ?
                            <React.Fragment>
                              <NavLink className="header__nav-link" to="/signup" onClick={this.closeMobileMenu}><Trans
                                id='NAV_LABEL_REGISTER'>Registrieren</Trans></NavLink>
                              <NavLink className="header__nav-link" to="/login" onClick={this.closeMobileMenu}><Trans
                                id='NAV_LABEL_LOGIN'>Login</Trans></NavLink>
                            </React.Fragment>
                            :
                            <NavLink className="header__nav-link" to="/user-logout"
                                     onClick={this.closeMobileMenu}><Trans
                              id='NAV_LABEL_LOGOUT'>Logout</Trans></NavLink>
                        }
                        <div className="header__nav-divider"/>
                        {
                          language == 'de' ?
                            <a className="header__nav-link" onClick={() => switchLanguage('en')}><Trans
                              id='NAV_LANG_ENGLISH'/></a>
                            : null
                        }
                        {
                          language == 'en' ?
                            <a className="header__nav-link" onClick={() => switchLanguage('de')}><Trans
                              id='NAV_LANG_GERMAN'/></a>
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
