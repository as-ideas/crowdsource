import React from "react";
import {I18n} from "@lingui/react";
import {AuthContextConsumer} from "../../contexts/AuthContext";
import {t} from "@lingui/macro";
import {Trans} from '@lingui/react';
import PageMeta from "../../layout/PageMeta";


export default class LogoutPage extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <React.Fragment>
        <I18n>
          {({i18n}) => (
            <PageMeta title={i18n._(t("NAV_LABEL_LOGOUT")`Logout`)}/>
          )}
        </I18n>
        <AuthContextConsumer>
          {({isLoggedIn, logout}) => (
            <React.Fragment>
              {
                isLoggedIn ? logout() : null
              }
              <div className='teaser--slim'/>
              <content-row className="logout-success">
                <div className="container">
                  <div className="box--centered">
                    <h1 translate="LOGOUT_HEADLINE">Du wurdest ausgeloggt</h1>
                    <p><Trans id="LOGOUT_LINK_LOGIN" values={{
                      link: <a href='/login' class='relogin'><Trans id="LOGOUT_LINK_LOGIN_LINK"/></a>
                    }}/></p>
                  </div>
                </div>
              </content-row>
            </React.Fragment>
          )}
        </AuthContextConsumer>
      </React.Fragment>
    );
  };
};
