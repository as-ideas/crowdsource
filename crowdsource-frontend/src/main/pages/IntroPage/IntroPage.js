import React from "react";
import IntroHero from "./IntroHero";
import ContentHero from "../../layout/ContentHero";
import IntroIdeasCampaignList from "./IntroIdeasCampaignList";
import AuthService from "../../util/AuthService";
import IdeaService from "../../util/IdeaService";
import RoutingService from "../../util/RoutingService";
import {Trans} from '@lingui/macro';


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
        <IntroHero/>

        <content-row className="campaign">
          <div className="container">
            {
              this.isLoggedIn() ?
                <div className="row">
                  <ContentHero
                    title={<Trans id='OVERVIEW_CAMPAIGN_HEADLINE'/>}
                    description={<Trans id='OVERVIEW_CAMPAIGN_DESCRIPTION'/>}
                  />
                  <IntroIdeasCampaignList/>
                </div>
                : null
            }

            {
              !this.isLoggedIn() ?
                <div className="campaign-login__container">
                  <ContentHero
                    title={<Trans id='INTRO_HEADLINE'/>}
                    description={<Trans id="INTRO_DESC"/>}
                  />
                  <button className="button-primary" onClick={RoutingService.goToSignUpPage}>
                    <Trans id='BUTTON_LABEL_REGISTER'>Register</Trans>
                  </button>
                </div>
                : null
            }

          </div>
        </content-row>
      </React.Fragment>
    )
  };
};
