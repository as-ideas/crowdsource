import React from "react";
import {Trans} from "@lingui/macro";
import ContentHero from "../../layout/ContentHero";
import ValidationService from "../../util/ValidationService";
import IdeaService from "../../util/IdeaService";

/**
 * Props:
 *  idea
 *  cancel-callback
 *  submit-callback
 */
export default class IdeaEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      input: {title: "", pitch: ""},
      errors: {},
    };

    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handlePitchInputChange = this.handlePitchInputChange.bind(this);
    this.submit = this.submit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
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
    if (this.state.pending) {
      return;
    } else if (this.validateForm()) {
      this.state.pending = true;
      this.setState(this.state);

      IdeaService.createIdea(this.props.campaign.id, {title: this.state.input.title, pitch: this.state.input.pitch})
        .then((response) => {
          if (response.errorCode) {
            this.state.errors = ValidationService.errorObjectFromBackend(response);
            this.setState(this.state);
          } else {
            this.state.input = {title: "", pitch: ""};
            this.props.successCallback ? this.props.successCallback(response) : null;
          }
        })
        .catch(console.error)
        .finally(() => {
          this.state.pending = false;
          this.setState(this.state);
        })
    } else {
      console.error("Invalid form!");
    }
  }

  validateForm() {
    this.state.errors = {};

    if (!this.state.input.title) {
      this.state.errors.title = ['FORM_IDEA_EDIT_TITLE_ERROR_REQUIRED'];
    } else {
      if (this.state.input.title.length < 5) {
        this.state.errors.title = [{label: 'FORM_ERROR_MIN_CHARS', value: {value: 5}}];
      }
      if (this.state.input.title.length > 25) {
        this.state.errors.title = [{label: 'FORM_ERROR_MAX_CHARS', value: {value: 25}}];
      }
    }

    if (!this.state.input.pitch) {
      this.state.errors.pitch = ['FORM_IDEA_EDIT_PITCH_ERROR_REQUIRED'];
    } else {
      if (this.state.input.pitch.length < 5) {
        this.state.errors.pitch = [{label: 'FORM_ERROR_MIN_CHARS', value: {value: 5}}];
      }
      if (this.state.input.pitch.length > 255) {
        this.state.errors.pitch = [{label: 'FORM_ERROR_MAX_CHARS', value: {value: 255}}];
      }
    }

    this.setState(this.state);
    return this.isValidForm();
  }

  isValidForm() {
    return Object.keys(this.state.errors).length === 0;
  }

  // FIXME react what does cancel do?!
  cancel() {
    // this.input.idea.contentI18n.original.title = vm.resetTitle;
    // this.input.idea.contentI18n.original.pitch = vm.resetPitch;
    // $scope.cancelFn();
    // reset: {
    //   title: this.props.idea.contentI18n != null ? this.props.idea.contentI18n.original.title : '',
    //     pitch: this.props.idea.contentI18n != null ? this.props.idea.contentI18n.original.pitch : '',
    // }
  }

  render() {
    let campaign = this.props.campaign ? this.props.campaign : {};
    let cancelEnabled = null; // FIXME react what is cancel?
    // success-fn="ideasList.reloadOwnIdeas"

    return (
      <idea-add>
        <ContentHero title="IDEAS_ADD_HEADLINE" description="IDEAS_ADD_DESC"/>

        <div className="idea-add__container">
          <idea-edit>
            <div name="ideaEditForm">
              <label form-group="title">
                {
                  this.state.errors.title ?
                    this.state.errors.title.map(error => {
                      return <span className="invalid-label" key={error}><Trans id={error.label ? error.label : error} values={error.value}/></span>
                    })
                    : <span className="valid-label"><Trans id="FORM_IDEA_EDIT_TITLE_LABEL">Titel Deiner Idee</Trans></span>
                }


                <input disabled={!campaign.active}
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
                      return <span className="invalid-label" key={error}><Trans id={error.label ? error.label : error} values={error.value}/></span>
                    })
                    : <span className="valid-label"><Trans id="FORM_IDEA_EDIT_PITCH_LABEL">Deine Idee im Detail</Trans></span>
                }

                <textarea disabled={!campaign.active}
                          name="pitch"
                          value={this.state.input.pitch}
                          onChange={this.handlePitchInputChange}
                          className="idea-add__pitch"
                          required/>
              </label>

              {
                cancelEnabled ?
                  <button type="cancel"
                          onClick={this.cancel}
                          className="button-secondary--halfwidth"><Trans id="BUTTON_LABEL_CANCEL">Abbrechen</Trans></button>
                  : null
              }

              <button disabled={!this.state.errors.title || !this.state.errors.pitch}
                      onClick={this.submit}
                      className={cancelEnabled ? 'button-primary--halfwidth' : 'button-primary'}>
                <Trans id="BUTTON_LABEL_SAVE">Absenden</Trans>
              </button>
            </div>
          </idea-edit>
        </div>
      </idea-add>
    )
  };
};
