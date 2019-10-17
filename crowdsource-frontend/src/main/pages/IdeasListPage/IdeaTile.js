import React from "react";
import TextFormatService from "../../util/TextFromatService";
import {Tran, Plural} from "@lingui/macro";
import TranslationService from "../../util/TranslationService";
import IdeaService from "../../util/IdeaService";
import PropTypes from "prop-types";

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
      rating: this.props.idea.rating || DEFAULT_RATING,
      isVotingDisabled: !this.props.campaign.active || false
    }
  }

  isTranslated(currentLanguage) {
    let contentI18n = this.props.idea.contentI18n;

    if (!contentI18n || !contentI18n.originalLanguage) {
      return false;
    }

    return contentI18n.originalLanguage.toLowerCase() !== currentLanguage.toLowerCase();
  }

  vote(value) {
    let campaign = this.props.campaign;
    let idea = this.props.idea;

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
          // FIXME react overlay?
          // $rootScope.$broadcast('VOTE_' + vm.idea.id, {type: 'success', message: $filter('translate')('IDEA_REMOVE_VOTE_MESSAGE')});
        } else {
          // $rootScope.$broadcast('VOTE_' + vm.idea.id, {type: 'success', message: $filter('translate')('IDEA_VOTE_MESSAGE')});
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

  selectTranslation(value) {

  }

  render() {
    let campaign = this.props.campaign;
    let campaignId = campaign.id;
    let idea = this.props.idea;

    let isVotingDisabled = this.state.isVotingDisabled;
    let rating = this.state.rating;
    rating.averageRating = Math.round(rating.averageRating * 10) / 10;

    let rejectionComment = "";
    let isEditable = false;
    let isAdminView = this.props.admin || false;
    let isOwnView = this.props.own || false;

    let contentI18n = this.props.idea.contentI18n;
    let currentLanguage = TranslationService.getCurrentLanguage();

    let title = null;
    let pitch = null;

    let isTranslated = this.isTranslated(currentLanguage);
    let isTranslationSelected = true;

    if (!contentI18n || !contentI18n.originalLanguage) {
      title = idea.title;
      pitch = idea.pitch;
    } else if (isTranslated && isTranslationSelected) {
      title = contentI18n[currentLanguage].title;
      pitch = contentI18n[currentLanguage].pitch;
    } else {
      title = contentI18n.original.title;
      pitch = contentI18n.original.pitch;
    }

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
                {/* FIXME react */}
                {/*<idea-edit idea="vm.idea" cancel-callback="vm.cancelEdit" submit-callback="vm.update"></idea-edit>*/}
              </div>
              : null

          }

          {
            !isAdminView && (idea.status === 'PROPOSED') && !isEditable ?
              <div className="ideas-grid-tile__edit-container">
                <button disabled={!campaign.active}
                        ng-click="vm.edit()"
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
                        <span form-label-valid="rejectionMessage" translate="FORM_ADMIN_IDEA_REJECT_REASON_LABEL">Ablehnungsgrund</span>
                        <span form-label-invalid="rejectionMessage" ng-messages="rejectionForm.rejectionMessage.$error">
                          <span ng-message="minlength"><span><Trans id="FORM_ERROR_MIN_CHARS" values={{value: "10"}}>Mindestens 10 Zeichen</Trans></span></span>
                          <span ng-message="maxlength"><span><Trans id="FORM_ERROR_MAX_CHARS" values={{value: "1000"}}>Maximal 10000 Zeichen</Trans></span></span>
                          <span ng-message="required"><span><Trans id="FORM_ADMIN_IDEA_REJECT_REASON_ERROR_REQUIRED">Bitte Ablehnungsgrund angeben</Trans></span></span>
                        </span>
                        <textarea campaign-active-aware rows="3" className="ideas-grid-tile__reject-textarea" ng-minlength="10" ng-model="vm.rejectionComment" name="rejectionMessage" placeholder="Ablehnungsgrund" translate-attr="{ placeholder: 'FORM_ADMIN_IDEA_REJECT_REASON_PLACEHOLDER' }"></textarea>
                      </label>
                    </form>
                    <button campaign-active-aware ng-click="vm.reject()" className="button-reject--halfwidth" ng-disabled="!vm.rejectionComment.length" translate="BUTTON_LABEL_REJECT">Ablehnen</button>
                    <button campaign-active-aware ng-click="vm.publish()" className="button-accept--halfwidth" translate="BUTTON_LABEL_APPROVE">Freigeben</button>
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
