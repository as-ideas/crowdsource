import React from "react";
import IntroHero from "./IntroHero";
import ContentHero from "../../layout/ContentHero";
import IntroIdeasCampaignList from "./IntroIdeasCampaignList";
import AuthService from "../../util/AuthService";
import {Helmet} from "react-helmet";
import {Trans, t} from '@lingui/macro';
import { I18n } from "@lingui/react"


export default class IntroPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
  }

  isLoggedIn() {
    return AuthService.currentUser.loggedIn;
  }


  render() {
    return (
      <React.Fragment>
      <I18n>
        {({ i18n }) => (
        <Helmet>
          <title>{i18n._(t("NAV_LABEL_OVERVIEW")`Übersicht`)}</title>
        </Helmet>
        )}
      </I18n>
      <IntroHero/>
        <content-row className="campaign">
          <div className="container">
            {
              this.isLoggedIn() ?
                <div className="row">
                  <ContentHero
                    title='OVERVIEW_CAMPAIGN_HEADLINE'
                    description='OVERVIEW_CAMPAIGN_DESCRIPTION'
                  />
                  <IntroIdeasCampaignList/>
                </div>
                : <div className="campaign-login__container">
                  <ContentHero
                    title={<Trans id='INTRO_HEADLINE'/>}
                    description={<Trans id="INTRO_DESC"/>}
                  />
                  <button className="button-primary" onClick={RoutingService.goToSignUpPage}>
                    <Trans id='BUTTON_LABEL_REGISTER'>Register</Trans>
                  </button>
                </div>
            }
          </div>
        </content-row>
      </React.Fragment>
    )
  };
};
