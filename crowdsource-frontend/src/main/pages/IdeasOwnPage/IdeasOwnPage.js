import React from "react";
import IdeaService, {IDEAS_STATUS} from "../../util/IdeaService";
import IdeaTeaser from "../IdeasListPage/IdeaTeaser";
import {Trans} from '@lingui/macro';
import IdeasOwnStatistics from "./IdeasOwnStatistics";
import IdeaTile from "../IdeasListPage/IdeaTile";
import Overlay from "../../layout/Overlay";

export default class IdeasOwnPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

  }

  componentDidMount() {
    let ideaCampaignId = this.props.match.ideasId;


    IdeaService.getCampaign(ideaCampaignId)
      .then((campaign) => {
        this.setState({campaign: campaign});
      })
      .catch(error => console.error(error));

    IdeaService.getOwnIdeas(ideaCampaignId)
      .then((res) => {
        this.setState({ideas: res});
      })
      .catch(error => console.error(error));
  }

  render() {
    let ideas = this.state.ideas;
    let campaign = this.state.campaign;
    let published = ideas.filter(el => el.status === IDEAS_STATUS.PUBLISHED);
    let proposed = ideas.filter(el => el.status === IDEAS_STATUS.PROPOSED);
    let rejected = ideas.filter(el => el.status === IDEAS_STATUS.REJECTED);

    return (
      <React.Fragment>
        <IdeaTeaser campaign={this.state.campaign}/>

        <content-row overlay="ADD_IDEA_SUCCESS">
          <div className="container">
            <div className="row">
              <IdeasOwnStatistics ideas={ideas}/>
            </div>
          </div>
        </content-row>

        <content-row>
          <div className="container">
            <section className="own-list__section">
              <div className="content-hero__container">
                <h2 className="content-hero__headline">
                  <Trans id={"IDEAS_OWN_SUBMITTED_HEADLINE"}>Eingereichte Ideen</Trans>
                </h2>
                <p className="content-hero__description">
                  <Trans id={"IDEAS_OWN_SUBMITTED_DESC"} values={{value: proposed.length}}>Ideen, die noch auf eine Freigabe warten:</Trans>
                </p>
              </div>
              <div className="ideas-grid__container">
                {
                  proposed.map(idea => {
                    return <div className="ideas-grid__box ideas-grid__proposed">
                      <Overlay type="success"
                               message={<Trans id={"IDEA_ADD_MESSAGE_1"}/> + '<br/>' + <Trans id="IDEA_ADD_MESSAGE_2"/>}
                               eventId={'VOTE_' + idea.id}
                      />
                      <IdeaTile campaign={campaign} idea={idea}/>
                    </div>
                  })
                }

              </div>
              {
                !proposed.length ?
                  <div className="ideas-grid__empty-label campaign-noentry">
                    <img className="campaign-noentry__image" src={require("./../IntroPage/campaigns-not-available-robot.svg")}/>
                  </div>
                  : null
              }

            </section>
          </div>
        </content-row>

        <content-row>
          <div className="container">
            <section className="own-list__section">

              <div className="content-hero__container ng-scope">
                <h2 className="content-hero__headline">
                  <Trans id={"IDEAS_OWN_PUBLISHED_HEADLINE"}>Veröffentlichte Ideen</Trans>
                </h2>
                <p className="content-hero__description">
                  <Trans id={"IDEAS_OWN_PUBLISHED_DESC"} values={{value: published.length}}>Ideen, die sich noch in der Abstimmung befinden: </Trans>
                </p>
              </div>

              <div className="ideas-grid__container">
                {
                  published.map(idea => {
                    return <div className="ideas-grid__box ideas-grid__published">
                      <Overlay type="success"
                               message={<Trans id={"IDEA_ADD_MESSAGE_1"}/> + '<br/>' + <Trans id="IDEA_ADD_MESSAGE_2"/>}
                               eventId={'VOTE_' + idea.id}
                      />
                      <IdeaTile campaign={campaign} idea={idea} own={true}/>
                    </div>
                  })
                }

              </div>
              {
                !published.length ?
                  <div className="ideas-grid__empty-label campaign-noentry">
                    <img className="campaign-noentry__image" src={require("./../IntroPage/campaigns-not-available-robot.svg")}/>
                  </div> : null
              }

            </section>
          </div>
        </content-row>

        <content-row>
          <div className="container">
            <section className="own-list__section">
              <div className="content-hero__container ng-scope">
                <h2 className="content-hero__headline">
                  <Trans id={"IDEAS_OWN_REJECTED_HEADLINE"}>Abgelehnte Ideen</Trans>
                </h2>
                <p className="content-hero__description">
                  <Trans id={"IDEAS_OWN_REJECTED_DESC"} values={{value: rejected.length}}>Ideen, die leider abgelehnt wurden: </Trans>
                </p>
              </div>
              <div className="ideas-grid__container">
                {
                  rejected.map(idea => {
                    return <div className="ideas-grid__box ideas-grid__rejected">
                      <IdeaTile campaign={campaign} idea={idea}/>
                    </div>
                  })
                }
              </div>
              {
                !rejected.length ?
                  <div className="ideas-grid__empty-label campaign-noentry">
                    <img className="campaign-noentry__image" src={require("./../IntroPage/campaigns-not-available-robot.svg")}/>
                  </div>
                  : null
              }
            </section>
          </div>
        </content-row>
      </React.Fragment>
    );
  };
};
