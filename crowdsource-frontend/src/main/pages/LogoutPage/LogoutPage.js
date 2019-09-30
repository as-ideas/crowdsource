import React from "react";
import AuthService from "../../util/AuthService";
import {I18n} from "@lingui/react";
import {Helmet} from "react-helmet";
import {t} from "@lingui/macro";

export default class LogoutPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    AuthService.logout();
  }

  componentDidMount() {
  }

  render() {
    return (
      <React.Fragment>
      <I18n>
      {({ i18n }) => (
        <Helmet>
        <title>{i18n._(t("NAV_LABEL_LOGOUT")`Logout`)}</title>
        </Helmet>
      )}
      </I18n>
        <div className='teaser--slim'/>

        <content-row className="logout-success">
          <div className="container">
            <div className="box--centered">
              <h1 translate="LOGOUT_HEADLINE">Du wurdest ausgeloggt</h1>
              <p translate="LOGOUT_LINK_LOGIN" translate-compile translate-values="{ link: '<a href=\'#/login\' class=\'relogin\' translate=\'LOGOUT_LINK_LOGIN_LINK\' translate-compile>temp</a>'}"></p>
            </div>
          </div>
        </content-row>
      </React.Fragment>
    );
  };
};
