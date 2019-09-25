import React from "react";
import IntroHero from "./IntroHero";
import ContentHero from "../../resources/layout/ContentHero";
import IntroIdeasCampaignList from "./IntroIdeasCampaignList";
import AuthService from "../../resources/util/AuthService";


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
        // FIXME react
        // IdeaService.getCampaigns()
        //     .then(
        //         function (response) {
        //             vm.entries = response;
        //         },
        //         function () {
        //             vm.entries = []
        //         }
        //     );

    }

    render() {
        return (
            <React.Fragment>
                <IntroHero/>

                <div className="campaign">
                    {
                        this.isLoggedIn() ?
                            <div className="row">
                                <ContentHero title="OVERVIEW_CAMPAIGN_HEADLINE" description="OVERVIEW_CAMPAIGN_DESCRIPTION"/>
                                <IntroIdeasCampaignList entries={this.state.ideas}/>
                            </div>
                            : null
                    }


                    <div ng-if="!intro.isLoggedIn" className="campaign-login__container">
                        <ContentHero title="INTRO_HEADLINE" description="INTRO_DESC"/>
                        <button className="button-primary" onClick="window.location='#/signup';" translate="BUTTON_LABEL_REGISTER">
                            Register
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    };
};
