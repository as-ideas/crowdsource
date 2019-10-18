import React from "react";
import IdeaTeaser from "./IdeaTeaser";
import ContentHero from "../../layout/ContentHero";
import IdeaTile from "./IdeaTile";
import IdeaService from "../../util/IdeaService";
import {t, Trans} from '@lingui/macro';
import LoadMore from "../../layout/LoadMore";
import IdeaAdd from "./IdeaAdd";
import PageMeta from "../../layout/PageMeta";

export default class IdeasListPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ideas: [],
      paging: {},
      campaign: {},
      selectedFilter: 'ALL'
    };

    this.loadMore = this.loadMore.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.useIdeasResponse = this.useIdeasResponse.bind(this);
  }

  componentDidMount() {
    // this is the current campaign id!
    let ideaId = this.getCurrentCampaignId();

    IdeaService.getCampaign(ideaId)
      .then((campaign) => {
        this.state.campaign = campaign;
        this.setState(this.state);
      })
      .catch(error => console.error(error));

    this.setFilter('ALL');
  }

  getCurrentCampaignId() {
    return this.props.match.params.ideasId;
  }

  setFilter(filter) {
    this.state.selectedFilter = filter;
    this.state.ideas = [];
    this.state.paging = {};
    this.setState(this.state);
    this.loadMore(0);
  }

  useIdeasResponse(ideasResponse) {
    this.state.ideas = [...ideasResponse.content];

    // delete the content, we only want the PAGE object stuff
    delete ideasResponse.content;
    this.state.paging = ideasResponse;

    this.setState(this.state);
  };

  loadMore(page) {
    let campaignId = this.getCurrentCampaignId();

    switch (this.state.selectedFilter) {
      case 'ALL': {
        IdeaService.getAll(campaignId, page)
          .then(this.useIdeasResponse)
          .catch(console.error);
        break;
      }
      case 'VOTED': {
        IdeaService.getAlreadyVoted(campaignId, true, page)
          .then(this.useIdeasResponse)
          .catch(console.error);
        break;
      }
      case 'NOT_VOTED': {
        IdeaService.getAlreadyVoted(campaignId, false, page)
          .then(this.useIdeasResponse)
          .catch(console.error);
        break;
      }
      default:
        console.error("Unkown filter!", this.state.selectedFilter);
    }
  }

  reloadOwnIdeas() {
    console.info("reloadOwnIdeas");
  }

  render() {
    let campaign = this.state.campaign;
    let title = this.state.campaign.contentI18n ? this.state.campaign.contentI18n.de.title : "";
    let selectedFilter = this.state.selectedFilter;
    let ideas = this.state.ideas;

    return (
      <React.Fragment>
        <PageMeta title={title}/>

        <IdeaTeaser campaign={this.state.campaign}/>

        <content-row overlay="ADD_IDEA_SUCCESS">
          <div className="container">
            <IdeaAdd campaign={campaign} success-callback={this.reloadOwnIdeas}/>
          </div>
        </content-row>

        <content-row className="logout-success">
          <div className="container">
            <section>
              <ContentHero title="IDEAS_VOTE_HEADLINE" description="IDEAS_VOTE_DESC"/>

              <ul className="ideas-list__filter">
                <li>
                  <a name="FILTER_ALL"
                     className={selectedFilter === 'ALL' ? 'active' : ''}
                     onClick={() => this.setFilter('ALL')}>
                    <Trans id="FILTER_ALL_LABEL"/>
                  </a>
                </li>
                <li>
                  <a name="FILTER_NOT_VOTED"
                     className={selectedFilter === 'NOT_VOTED' ? 'active' : ''}
                     onClick={() => this.setFilter('NOT_VOTED')}>
                    <Trans id="FILTER_NOT_VOTED_LABEL"/>
                  </a>
                </li>
                <li>
                  <a name="FILTER_VOTED"
                     className={selectedFilter === 'VOTED' ? 'active' : ''}
                     onClick={() => this.setFilter('VOTED')}>
                    <Trans id="FILTER_VOTED_LABEL"/>
                  </a>
                </li>
              </ul>
              <div className="ideas-grid__container">
                {
                  ideas.map(idea => {
                    return <div className="ideas-grid__box" overlay="{{'VOTE_'+idea.id}}">
                      <IdeaTile campaign={campaign} idea={idea}/>
                    </div>
                  })
                }

              </div>
            </section>

            {
              !ideas.length ?
                <div className="ideas-grid__empty-label campaign-noentry">
                  <img className=" campaign-noentry__image"
                       src={require('./../IntroPage/campaigns-not-available-robot.svg')}/>
                </div> : null
            }

            {
              !this.state.paging.last ?
                <LoadMore paging={this.state.paging}
                          no-more-label="IDEAS_LOAD_MORE_LABEL_NO_MORE"
                          load-more-label="'IDEAS_LOAD_MORE_LABEL'"
                          load-more={this.loadMore}/>
                : null
            }


          </div>
        </content-row>
      </React.Fragment>
    );
  };
};
