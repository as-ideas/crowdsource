import React from "react";
import IdeaTeaser from "./IdeaTeaser";
import ContentHero from "../../layout/ContentHero";
import IdeaTitle from "./IdeaTitle";
import IdeaService from "../../util/IdeaService";
import {Trans} from '@lingui/macro';
import LoadMore from "../../layout/LoadMore";

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
  }

  componentDidMount() {
    // this is the current campaign!
    let ideaId = this.props.match.params.ideasId;
    IdeaService.getCampaign(ideaId)
      .then((campaign) => {
        this.state.campaign = campaign;
      })
      .catch(error => console.error(error));
  }

  setFilter(filter) {
    this.state.selectedFilter = filter;
    this.state.ideas = [];
    this.state.paging = {};
    this.setState(this.state);
    this.loadMore(0);
  }

  loadMore(page) {
    let useIdeasResponse = (ideas) => {
      this.state.ideas = [...ideas.content];
      delete ideas.content;
      this.state.paging = ideas;
    };

    switch (this.state.selectedFilter) {
      case 'FILTER_ALL': {
        IdeaService.getAll(this.state.campaign.id, page)
          .then(useIdeasResponse)
          .catch(console.error);
        break;
      }
      case 'FILTER_VOTED': {
        IdeaService.getAlreadyVoted(this.state.campaign.id, true, page)
          .then(useIdeasResponse)
          .catch(console.error);
        break;
      }
      case 'FILTER_NOT_VOTED': {
        IdeaService.getAlreadyVoted(this.state.campaign.id, false, page)
          .then(useIdeasResponse)
          .catch(console.error);
        break;
      }
      default:
        console.error("Unkown filter!");
    }
  }


  render() {
    let campaign = this.state.campaign;
    let selectedFilter = this.state.selectedFilter;

    return (
      <React.Fragment>
        <IdeaTeaser campaign={this.state.campaign}/>

        <content-row overlay="ADD_IDEA_SUCCESS">
          <div className="container">
            {/* FIXME add component*/}
            <idea-add campaign={campaign} success-fn="ideasList.reloadOwnIdeas"/>
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
                  this.state.ideas.map(idea => {
                    return <div className="ideas-grid__box" overlay="{{'VOTE_'+idea.id}}">
                      <IdeaTitle campaign={ideasList.campaign} idea={idea}/>
                    </div>
                  })
                }

              </div>
            </section>

            {
              !ideasList.ideas.length ?
                <div className="ideas-grid__empty-label campaign-noentry">
                  <img className=" campaign-noentry__image" src={require('./../IntroPage/campaigns-not-available-robot.svg')}/>
                </div> : null
            }

            {
              !ideasList.paging.last ?
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
