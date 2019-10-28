import React from "react";
import TextFormatService from "../../util/TextFromatService";
import {Trans, Plural} from "@lingui/macro";
import TranslationService from "../../util/TranslationService";
import IdeaService from "../../util/IdeaService";
import PropTypes from "prop-types";
import Events from "../../util/Events";
import {translate} from "../../contexts/I18nContext";
import IdeaEdit from "./IdeaEdit";

const DEFAULT_RATING = {
  ownVote: 0,
  averageRating: 0,
  countVotes: 0
};

export default class IdeaTile extends React.Component {
  static propTypes = {
    idea: PropTypes.object,
    campaign: PropTypes.object,
    own: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      idea: this.props.idea,
      rating: this.props.idea.rating || DEFAULT_RATING,
      isVotingDisabled: !this.props.campaign.active || false,
      isEditable: false,
      input: {
        rejectionComment: ""
      },
      errors: {}
    }
  }

  isTranslated(currentLanguage) {
    let contentI18n = this.state.idea.contentI18n;

    if (!contentI18n || !contentI18n.originalLanguage) {
      return false;
    }

    return contentI18n.originalLanguage.toLowerCase() !== currentLanguage.toLowerCase();
  }

  vote(value) {
    let campaign = this.props.campaign;
    let idea = this.state.idea;

    if (this.state.isVotingDisabled) {
      return;
    }

    // reset voting by setting value to null, if user clicks on same value
    if (this.state.rating.ownVote === value) {
      value = 0;
    }

    this.state.isVotingDisabled = true;
    this.setState(this.state);

    IdeaService.voteIdea(campaign.id, idea.id, value)
      .then((rating) => {
        if (value === 0) {
          Events.emitEvent('VOTE_' + idea.id, {type: 'success', message: translate('IDEA_REMOVE_VOTE_MESSAGE')});
        } else {
          Events.emitEvent('VOTE_' + idea.id, {type: 'success', message: translate('IDEA_VOTE_MESSAGE')});
        }
        this.state.rating = rating;
        this.state.rating.averageRating = Math.round(this.state.rating.averageRating * 10) / 10;
      })
      .finally(() => {
        window.setTimeout(() => {
          this.state.isVotingDisabled = false;
          this.setState(this.state);
        }, 1000);
      });
  }

  edit() {
    this.setState({isEditable: true})
  }

  editDone() {
    IdeaService.getIdea(this.props.campaign.id, this.state.idea.id)
      .then((idea) => {
        this.setState({
          idea: idea,
          isEditable: false
        })
      });
  }

  reject() {
    if (!this.props.admin) {
      throw Error('rejection is only allowed for admin');
    }
    IdeaService.rejectIdea(this.props.campaign.id, this.state.idea.id)
      .then(() => {
        Events.emitEvent('ADMIN_' + this.state.idea.id, {type: 'failure', message: translate('ADMIN_IDEA_REJECT_MESSAGE')});
      });
  }

  publish() {
    if (!this.props.admin) {
      throw Error('publishing is only allowed for admin');
    }
    IdeaService.publishIdea(this.props.campaign.id, this.state.idea.id)
      .then(() => {
        Events.emitEvent('ADMIN_' + this.state.idea.id, {type: 'success', message: translate('ADMIN_IDEA_PUBLISH_MESSAGE')});
      });
  }

  selectTranslation(value) {
    // FIXME REACT
  }

  handleRejectionCommentInputChange(e) {
    this.state.input.rejectionComment = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  render() {
    let campaign = this.props.campaign;
    let idea = this.state.idea;

    let isVotingDisabled = this.state.isVotingDisabled;
    let rating = this.state.rating;
    rating.averageRating = Math.round(rating.averageRating * 10) / 10;

    let rejectionComment = "";
    let isEditable = this.state.isEditable;
    let isAdminView = this.props.admin || false;
    let isOwnView = this.props.own || false;

    let currentLanguage = TranslationService.getCurrentLanguage();

    let title = idea.title;
    let pitch = idea.pitch;

    let isTranslated = this.isTranslated(currentLanguage);
    let isTranslationSelected = true;

    return (
      <idea-title>
        <div className="ideas-grid-tile">

          {
            idea.status === 'PUBLISHED' ?
              <div>
                <span className="ideas-grid-tile__title">{title}</span>
                <span className="ideas-grid-tile__votes">
                  <Trans id="IDEA_TILE_AVG_RATING"
                         values={{
                           rating: rating.averageRating,
                           votes: rating.countVotes
                         }}/>
                </span>
              </div>
              : null
          }

          {
            !(idea.status === 'PUBLISHED') && !isEditable ?
              <div>
                <span className="ideas-grid-tile__title">{idea.contentI18n.original.title}</span>
              </div>
              : null
          }

          {
            idea.status === 'PUBLISHED' && !isOwnView ?
              <p className="ideas-grid-tile__text">{pitch}
                ({idea.creatorName})
              </p>
              : null
          }

          {
            idea.status === 'PUBLISHED' && isOwnView ?
              <p className="ideas-grid-tile__text">{pitch}</p>
              : null
          }


          {
            !(idea.status === 'PUBLISHED') && isAdminView ?
              <p className={idea.status === 'REJECTED' ? 'ideas-grid-tile__text--rejected' : 'ideas-grid-tile__text'}>
                {idea.contentI18n.original.pitch} ({idea.creatorName})
              </p>
              : null
          }

          {
            !(idea.status === 'PUBLISHED') && !isEditable && !isAdminView ?
              <p className={idea.status === 'REJECTED' ? 'ideas-grid-tile__text--rejected' : 'ideas-grid-tile__text'}>
                {idea.contentI18n.original.pitch}
              </p>
              : null
          }

          {
            idea.status === 'PUBLISHED' && !isAdminView ?
              <div className="ideas-grid-tile__rating ideas-grid-tile__bottom-container">
                {
                  !isVotingDisabled ?
                    <React.Fragment>
                      <div onClick={() => this.vote(5)} className={'star5 ' + (rating.ownVote >= 5 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated')}/>

                      <div onClick={() => this.vote(4)} className={'star5 ' + (rating.ownVote >= 4 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated')}/>

                      <div onClick={() => this.vote(3)} className={'star5 ' + (rating.ownVote >= 3 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated')}/>

                      <div onClick={() => this.vote(2)} className={'star5 ' + (rating.ownVote >= 2 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated')}/>

                      <div onClick={() => this.vote(1)} className={'star5 ' + (rating.ownVote >= 1 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated')}/>
                    </React.Fragment>
                    : <React.Fragment>
                      <div className={'star5 ' + (rating.ownVote >= 5 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled')}/>

                      <div className={'star5 ' + (rating.ownVote >= 4 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled')}/>

                      <div className={'star5 ' + (rating.ownVote >= 3 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled')}/>

                      <div className={'star5 ' + (rating.ownVote >= 2 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled')}/>


                      <div className={'star5 ' + rating.ownVote >= 1 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled'}/>
                    </React.Fragment>
                }
              </div>
              : null
          }

          {
            isEditable ?
              <div className="ideas-grid-tile__approval-container">
                {/*<idea-edit idea="vm.idea" cancel-callback="vm.cancelEdit" submit-callback="vm.update"></idea-edit>*/}
                <IdeaEdit campaign={campaign} idea={idea} finishedCallback={this.editDone.bind(this)}/>
              </div>
              : null

          }

          {
            !isAdminView && (idea.status === 'PROPOSED') && !isEditable ?
              <div className="ideas-grid-tile__edit-container">
                <button disabled={!campaign.active}
                        onClick={this.edit.bind(this)}
                        className="button-secondary--fullwidth">
                  <Trans id="BUTTON_LABEL_EDIT">Bearbeiten</Trans>
                </button>
              </div>
              : null
          }

          {
            idea.status === 'REJECTED' ?
              <div className="ideas-grid-tile__rejected-container">
                <p className="ideas-grid-tile__rejected-message">{idea.rejectionComment}</p>
              </div>
              : null
          }


          {
            isAdminView && idea.status === 'PROPOSED' ?
              <div className="ideas-grid-tile__approval-spacer">
                <div className="ideas-grid-tile__approval-container">
                  <div>
                    <form name="rejectionForm">
                      <label>
                        {
                          this.state.errors.rejectionComment ?
                            this.state.errors.rejectionComment.map(error => {
                              return <span className="invalid-label" key={error}><Trans id={error.label ? error.label : error} values={error.value}/></span>
                            })
                            : <span className="valid-label"><Trans id="FORM_IDEA_EDIT_TITLE_LABEL">Titel Deiner Idee</Trans></span>
                        }
                        <textarea campaign-active-aware
                                  rows="3"
                                  className="ideas-grid-tile__reject-textarea"
                                  ng-minlength="10"
                                  value={this.state.input.rejectionComment}
                                  onChange={this.handleRejectionCommentInputChange}
                                  name="rejectionMessage"
                                  placeholder="Ablehnungsgrund"
                                  translate-attr="{ placeholder: 'FORM_ADMIN_IDEA_REJECT_REASON_PLACEHOLDER' }"
                        />
                      </label>
                    </form>
                    <button campaign-active-aware
                            onClick={this.reject.bind(this)}
                            className="button-reject--halfwidth"
                            ng-disabled="!vm.rejectionComment.length">
                      <Trans id="BUTTON_LABEL_REJECT">Ablehnen</Trans>
                    </button>
                    <button campaign-active-aware
                            onClick={this.publish.bind(this)}
                            className="button-accept--halfwidth">
                      <Trans id="BUTTON_LABEL_APPROVE">Freigeben</Trans>
                    </button>
                  </div>
                </div>
              </div>
              : null
          }


          {
            isTranslated && isTranslationSelected && currentLanguage === 'de' ?
              <div className="ideas-grid-tile__deepl_de" onClick={() => {
                this.selectTranslation(false)
              }}/>
              : null
          }

          {
            isTranslated && isTranslationSelected && currentLanguage === 'en' ?
              <div className="ideas-grid-tile__deepl_en" onClick={() => {
                this.selectTranslation(false)
              }}/>
              : null
          }

          {
            isTranslated && !isTranslationSelected && currentLanguage === 'de' ?
              <div className="ideas-grid-tile__deepl_de--inactive" onClick={() => {
                this.selectTranslation(true)
              }}/>
              : null
          }

          {
            isTranslated && !isTranslationSelected && currentLanguage === 'en' ?
              <div className="ideas-grid-tile__deepl_en--inactive" onClick={() => {
                this.selectTranslation(true)
              }}/>
              : null
          }


        </div>

      </idea-title>
    )
  };
};
