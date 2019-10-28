import React from "react";
import IdeaService, {IDEAS_STATUS} from "../../util/IdeaService";
import IdeaTeaser from "../IdeasListPage/IdeaTeaser";
import {Trans} from '@lingui/macro';
import IdeaTile from "../IdeasListPage/IdeaTile";
import Overlay from "../../layout/Overlay";

export default class IdeasAdminPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      campaign: {},
      pendingIdeas: [],
      pendingIdeasTotal: 0,
      rejectedIdeas: [],
      rejectedIdeasTotal: 0,
    };

    this.reloadIdeas = this.reloadIdeas.bind(this);
  }

  componentDidMount() {
    let ideaCampaignId = this.props.match.params.ideasId;

    IdeaService.getCampaign(ideaCampaignId)
      .then((campaign) => {
        this.setState({campaign: campaign}, this.reloadIdeas);
      });
  }

  reloadIdeas() {
    IdeaService.getIdeasWithStatus(this.state.campaign.id, IDEAS_STATUS.REJECTED)
      .then((res) => {
        this.setState({
          rejectedIdeas: res.content,
          rejectedIdeasTotal: res.totalElements,
        });
      });

    IdeaService.getIdeasWithStatus(this.state.campaign.id, IDEAS_STATUS.PROPOSED)
      .then((res) => {
        this.setState({
          pendingIdeas: res.content,
          pendingIdeasTotal: res.totalElements,
        });
      });
  }

  render() {
    let pendingIdeas = this.state.pendingIdeas;
    let pendingIdeasTotal = this.state.pendingIdeasTotal;
    let rejectedIdeas = this.state.rejectedIdeas;
    let rejectedIdeasTotal = this.state.rejectedIdeasTotal;

    let campaign = this.state.campaign;

    return (
      <React.Fragment>
        <IdeaTeaser campaign={this.state.campaign}/>

        <content-row>
          <div className="container">
            <div className="content-hero__container">
              <h2 className="content-hero__headline">
                <Trans id="ADMIN_IDEAS_PENDING_HEADLINE"/>
              </h2>
              <p className="content-hero__description">
                <Trans id="ADMIN_IDEAS_PENDING_DESC" values={{value: pendingIdeasTotal}}/>
              </p>
            </div>

            <div className="ideas-grid__container">
              {
                pendingIdeas.map((idea) => {
                  return <div className="ideas-grid__box">
                    <Overlay eventId={"ADMIN_" + idea.id}/>
                    <IdeaTile campaign={campaign} admin={true} idea={idea}/>
                  </div>
                })
              }
            </div>
          </div>
        </content-row>

        <content-row>
          <div className="container">
            <div className="content-hero__container">
              <h2 className="content-hero__headline">
                <Trans id="ADMIN_IDEAS_DENIED_HEADLINE"/>
              </h2>
              <p className="content-hero__description">
                <Trans id="ADMIN_IDEAS_DENIED_DESC" values={{value: rejectedIdeasTotal}}/>
              </p>
            </div>

            <div className="ideas-grid__container">
              {
                rejectedIdeas.map((idea) => {
                  return <div className="ideas-grid__box">
                    <IdeaTile campaign={campaign} admin={true} idea={idea}/>
                  </div>
                })
              }
            </div>
          </div>
        </content-row>
      </React.Fragment>
    );
  };
};
