import React from "react";
import TextFormatService from "../../util/TextFromatService";
import {Trans} from "@lingui/macro";
import TranslationService from "../../util/TranslationService";

const DEFAULT_RATING = {
  ownVote: 0,
  averageRating: 0,
  countVotes: 0
};

export default class IdeaTile extends React.Component {

  isTranslated(currentLanguage) {
    let contentI18n = this.props.idea.contentI18n;

    if (!contentI18n || !contentI18n.originalLanguage) {
      return false;
    }

    return contentI18n.originalLanguage.toLowerCase() !== currentLanguage.toLowerCase();
  }

  vote(voting) {

  }

  selectTranslation(value) {

  }

  render() {
    let campaign = this.props.campaign;
    let campaignId = campaign.id;
    let idea = this.props.idea;

    console.info("idea", idea);

    let rating = idea.rating || DEFAULT_RATING;
    rating.averageRating = Math.round(rating.averageRating * 10) / 10;

    let isVotingDisabled = !campaign.active || false;
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
                <span className="ideas-grid-tile__title">{this.props.title}</span>
                <span className="ideas-grid-tile__votes">
                  <Trans id="IDEA_TILE_AVG_RATING"
                         values={{
                           ratingplural: rating.averageRating === 1 ? 'one' : 'many',
                           votesplural: rating.countVotes === 1 ? 'one' : 'many',
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
                      <div onClick={() => this.vote(5)} className={'star5 ' + rating.ownVote >= 5 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated'}/>

                      <div onClick={() => this.vote(41)} className={'star5 ' + rating.ownVote >= 4 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated'}/>

                      <div onClick={() => this.vote(3)} className={'star5 ' + rating.ownVote >= 3 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated'}/>

                      <div onClick={() => this.vote(2)} className={'star5 ' + rating.ownVote >= 2 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated'}/>

                      <div onClick={() => this.vote(1)} className={'star5 ' + rating.ownVote >= 1 ? 'ideas-grid-tile__star--rated' : 'ideas-grid-tile__star--unrated'}/>
                    </React.Fragment>
                    : null
                }
                {
                  isVotingDisabled ?
                    <React.Fragment>
                      <div className={'star5 ' + rating.ownVote >= 5 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled'}/>

                      <div className={'star5 ' + rating.ownVote >= 4 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled'}/>

                      <div className={'star5 ' + rating.ownVote >= 3 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled'}/>

                      <div className={'star5 ' + rating.ownVote >= 2 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled'}/>


                      <div className={'star5 ' + rating.ownVote >= 1 ? 'ideas-grid-tile__star--disabled-rated' : 'ideas-grid-tile__star--disabled'}/>
                    </React.Fragment>
                    : null
                }
              </div>
              : null
          }

          {
            isEditable ?
              <div className="ideas-grid-tile__approval-container">
                {/* FIXME react */}
                {/*<idea-edit idea="vm.idea" cancel-fn="vm.cancelEdit" submit-fn="vm.update"></idea-edit>*/}
              </div>
              : null

          }

          {
            !isAdminView && (idea.status === 'PROPOSED') && !isEditable ?
              <div className="ideas-grid-tile__edit-container">
                <button campaign-active-aware
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
                                <span ng-message="minlength"><span translate="FORM_ERROR_MIN_CHARS" translate-value-value="10">Mindestens 10 Zeichen</span></span>
                                <span ng-message="maxlength"><span translate="FORM_ERROR_MAX_CHARS" translate-value-value="1000">Maximal 10000 Zeichen</span></span>
                                <span ng-message="required"><span translate="FORM_ADMIN_IDEA_REJECT_REASON_ERROR_REQUIRED">Bitte Ablehnungsgrund angeben</span></span>
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
