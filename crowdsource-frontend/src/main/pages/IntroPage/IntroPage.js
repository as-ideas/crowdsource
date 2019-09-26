import React from "react";
import IntroHero from "./IntroHero";
import ContentHero from "../../layout/ContentHero";
import IntroIdeasCampaignList from "./IntroIdeasCampaignList";
import AuthService from "../../util/AuthService";
import IdeaService from "../../util/IdeaService";
import RoutingService from "../../util/RoutingService";


export default class IntroPage extends React.Component {


    constructor(props, context) {
        super(props, context);
        this.state = {ideas: []};
    }

    componentDidMount() {
        this.loadIdeaCampaigns();
    }

    isLoggedIn() {
        return AuthService.currentUser.loggedIn;
    }

    loadIdeaCampaigns() {
        IdeaService.getCampaigns()
            .then((response) => {
                this.setState({ideas: response});
            });
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
                                    <ContentHero title="OVERVIEW_CAMPAIGN_HEADLINE" description="OVERVIEW_CAMPAIGN_DESCRIPTION"/>
                                    <IntroIdeasCampaignList list={this.state.ideas}/>
                                </div>
                                : null
                        }

                        {
                            !this.isLoggedIn() ?
                                <div className="campaign-login__container">
                                    <ContentHero title="INTRO_HEADLINE" description="INTRO_DESC"/>
                                    <button className="button-primary" onClick={RoutingService.goToSignUpPage} translate="BUTTON_LABEL_REGISTER">
                                        Register
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
