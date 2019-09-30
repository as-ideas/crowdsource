import React from "react";
import TextFormatService from "../../util/TextFromatService";
import {Trans} from "@lingui/macro";
import TranslationService from "../../util/TranslationService";
import ContentHero from "../../layout/ContentHero";
import ValidationService from "../../util/ValidationService";
import IdeaService from "../../util/IdeaService";


export default class IdeaAdd extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      input: {title: "", pitch: ""},
      errors: {}
    };

    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handlePitchInputChange = this.handlePitchInputChange.bind(this);
    this.saveIdea = this.saveIdea.bind(this);
  }

  saveIdea() {
    if (this.state.pending) {
      return;
    }
    this.state.pending = true;

    IdeaService.createIdea(this.props.campaign.id, {title: this.state.input.title, pitch: this.state.input.pitch})
      .then((res) => {
        this.state.input = {title: "", pitch: ""};
        this.props.successCallback ? this.props.successCallback(res) : null;
      }).finally(() => {
      vm.pending = false;
    })
  }

  handleTitleInputChange(e) {
    this.state.input.title = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  handlePitchInputChange(e) {
    this.state.input.pitch = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  submit() {

  }

  validateForm() {
    this.state.errors = {};

    if (!this.state.input.title) {
      this.state.errors.title = ['FORM_IDEA_EDIT_TITLE_ERROR_REQUIRED'];
    } else {
      if (this.state.input.title.length < 5) {
        this.state.errors.title = [{label: 'FORM_ERROR_MIN_CHARS', value: 5}];
      }
      if (this.state.input.title.length > 25) {
        this.state.errors.title = [{label: 'FORM_ERROR_MAX_CHARS', value: 25}];
      }
    }

    if (!this.state.input.pitch) {
      this.state.errors.pitch = ['FORM_IDEA_EDIT_PITCH_ERROR_REQUIRED'];
    } else {
      if (this.state.input.title.length < 5) {
        this.state.errors.pitch = [{label: 'FORM_ERROR_MIN_CHARS', value: 5}];
      }
      if (this.state.input.title.length > 255) {
        this.state.errors.pitch = [{label: 'FORM_ERROR_MAX_CHARS', value: 255}];
      }
    }


    this.setState(this.state);
    return this.isValidForm();
  }

  isValidForm() {
    return Object.keys(this.state.errors).length === 0;
  }

  cancel() {

  }

  render() {
    let campaign = this.props.campaign ? this.props.campaign : {};
    let idea = this.state.idea;
    let cancel = null;
    // success-fn="ideasList.reloadOwnIdeas"

    return (
      <idea-add>
        <ContentHero title="IDEAS_ADD_HEADLINE" description="IDEAS_ADD_DESC"/>

        <div className="idea-add__container">
          <idea-edit submit-fn="vm.send">
            <div name="ideaEditForm">
              <label form-group="title">
                {
                  this.state.errors.title ?
                    this.state.errors.title.map(error => {
                      return <span key={error}><Trans id={error.label ? error.label : error} values={error.value}/></span>
                    })
                    : <span><Trans id="FORM_IDEA_EDIT_TITLE_LABEL">Titel Deiner Idee</Trans></span>
                }


                <input campaign-active-aware
                       className="idea-add__title"
                       name="title"
                       type="text"
                       value={this.state.input.title}
                       onChange={this.handleTitleInputChange}
                       required
                       maxLength="25"/>
              </label>

              <label form-group="pitch">
                {
                  this.state.errors.pitch ?
                    this.state.errors.pitch.map(error => {
                      return <span key={error}><Trans id={error.label ? error.label : error} values={error.value}/></span>
                    })
                    : <span><Trans id="FORM_IDEA_EDIT_PITCH_LABEL">Deine Idee im Detail</Trans></span>
                }

                <textarea campaign-active-aware
                          name="pitch"
                          value={this.state.input.pitch}
                          onChange={this.handlePitchInputChange}
                          className="idea-add__pitch"
                          required/>
              </label>

              {
                cancel ?
                  <button type="cancel" ng-click="vm.cancel()" className="button-secondary--halfwidth" translate="BUTTON_LABEL_CANCEL">Abbrechen</button>
                  : null
              }

              <button ng-disabled="!ideaEditForm.title.$valid || !ideaEditForm.pitch.$valid"
                      onClick={this.submit}
                      className={cancel ? 'button-primary--halfwidth' : 'button-primary'}>
                <Trans id="BUTTON_LABEL_SAVE">Absenden</Trans>
              </button>
            </div>
          </idea-edit>
        </div>
      </idea-add>
    )
  };
};
