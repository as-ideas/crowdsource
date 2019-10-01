import React from "react";
import TranslationService from "../../util/TranslationService";
import {NavLink} from "react-router-dom";
import UserService from "../../util/UserService";
import RoutingService from "../../util/RoutingService";
import {t, Trans} from '@lingui/macro';
import ValidationService from "../../util/ValidationService";
import {I18n} from "@lingui/react";
import {Helmet} from "react-helmet";


export default class SignupPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      showTermsOfService: false,
      input: {
        firstName: "",
        lastName: "",
        email: "",
        termsOfServiceAccepted: false
      },
      errors: {}
    };

    this.signUp = this.signUp.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.toggleTerms = this.toggleTerms.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.handleFirstNameInputChange = this.handleFirstNameInputChange.bind(this);
    this.handleLastNameInputChange = this.handleLastNameInputChange.bind(this);
    this.handleTermsOfServiceAcceptedInputChange = this.handleTermsOfServiceAcceptedInputChange.bind(this);
  }

  componentDidMount() {
  }

  handleEmailInputChange(e) {
    this.state.input.email = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  handleFirstNameInputChange(e) {
    this.state.input.firstName = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  handleLastNameInputChange(e) {
    this.state.input.lastName = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  handleTermsOfServiceAcceptedInputChange(e) {
    this.state.input.termsOfServiceAccepted = !this.state.input.termsOfServiceAccepted;
    this.setState(this.state, this.validateForm);
  }

  signUp() {
    if (this.validateForm()) {
      this.state.errors.general = [];

      let user = this.state.input;
      UserService.register(user)
        .then((response) => {
          if (response.errorCode) {
            this.state.errors = ValidationService.errorObjectFromBackend(response);
            this.setState(this.state);
          } else {
            RoutingService.goToSuccessPageForUser(user);
          }
        })
        .catch((errorCode) => {
          console.error("Error", errorCode);
          this.state.errors.general = [errorCode];
        })
        .finally(() => {
          this.setState({loading: false});
        });
    } else {
      console.error("Invalid form!");
    }
  }

  validateForm() {
    this.state.errors = {};

    if (!this.state.input.email) {
      this.state.errors.email = ['FORM_EMAIL_ERROR_REQUIRED'];
    } else {
      if (!ValidationService.isEmailValid(this.state.input.email)) {
        this.state.errors.email = ['FORM_EMAIL_ERROR_INVALID'];
      }
    }

    if (!this.state.input.firstName) {
      this.state.errors.firstName = ['FORM_FORENAME_ERROR_REQUIRED'];
    }

    if (!this.state.input.lastName) {
      this.state.errors.lastName = ['FORM_SURNAME_ERROR_REQUIRED'];
    }

    if (!this.state.input.termsOfServiceAccepted) {
      this.state.errors.termsOfServiceAccepted = ['FORM_AGB_ERROR_REQUIRED'];
    }

    this.setState(this.state);
    return this.isValidForm();
  }

  isValidForm() {
    return Object.keys(this.state.errors).length === 0;
  }

  toggleTerms() {
    this.state.showTermsOfService = !this.state.showTermsOfService;
    this.setState(this.state);
  }

  //FORM_FORENAME_ERROR_REQUIRED
// FORM_SURNAME_ERROR_REQUIRED
  render() {
    return (
      <React.Fragment>
      <I18n>
      {({ i18n }) => (
        <Helmet>
        <title>{i18n._(t("NAV_LABEL_REGISTER")`Registrieren`)}</title>
        </Helmet>
      )}
      </I18n>
        <div className='teaser--slim'/>

        <content-row className="signup-form">
          <div className="container">
            <div name="signup.form" className="box">

              <div className="row">
                <div className="small-12 columns">
                  <h1><Trans id='REGISTER_HEADLINE'>Registrierung</Trans></h1>
                </div>
              </div>


              {
                this.state.errors.general ?
                  <div className="general-error alert-box alert">
                    {
                      this.state.errors.general.map(error => {
                        return <span key={error}><Trans id={error}/></span>
                      })
                    }
                  </div>
                  : null
              }

              <div className="row">
                <div className="small-12 columns form-controls-firstname">
                  <label form-group="firstName">
                    {
                      this.state.errors.firstName ?
                        <span className="invalid-label">
                                              {
                                                this.state.errors.firstName.map(error => {
                                                  return <span key={error}><Trans id={error}/></span>
                                                })
                                              }
                                            </span>
                        : <span className="valid-label" translate="FORM_FORENAME_LABEL">Vorname</span>
                    }

                    <input type="text"
                           name="firstName"
                           value={this.state.input.firstName}
                           onChange={this.handleFirstNameInputChange}
                           field-name="firstName"
                           required
                           reset-remote-validation
                           translate-attr="{ placeholder: 'FORM_FORENAME_PLACEHOLDER' }"/>
                  </label>
                </div>


                <div className="small-12 columns form-controls-lastname">
                  <label form-group="lastName">
                    {
                      this.state.errors.lastName ?
                        <span className="invalid-label">
                                              {
                                                this.state.errors.lastName.map(error => {
                                                  return <span key={error}><Trans id={error}/></span>
                                                })
                                              }
                                            </span>
                        : <span className="valid-label" translate="FORM_SURNAME_LABEL">Vorname</span>
                    }

                    <input type="text"
                           name="lastName"
                           value={this.state.input.lastName}
                           onChange={this.handleLastNameInputChange}
                           field-name="lastName"
                           required
                           reset-remote-validation
                           translate-attr="{ placeholder: 'FORM_SURNAME_PLACEHOLDER' }"/>
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns form-controls-email">
                  <label form-group="email">
                    {
                      this.state.errors.email ?
                        <span className="invalid-label">
                                              {
                                                this.state.errors.email.map(error => {
                                                  return <span key={error}>
                                                    {error === 'FORM_EMAIL_ERROR_ALREADY_ACTIVATED_1' ?
                                                      <React.Fragment>
                                                        <Trans id={error}/>
                                                        <NavLink to='/passwordrecovery'>
                                                          <Trans id='FORM_EMAIL_ERROR_ALREADY_ACTIVATED_2'/>
                                                        </NavLink>
                                                      </React.Fragment>
                                                      : <Trans id={error}/>
                                                    }
                                                  </span>
                                                })
                                              }
                                            </span>
                        : <span className="valid-label"> <Trans id="FORM_EMAIL_LABEL">E-Mail</Trans></span>
                    }
                  </label>

                  <div className="full-width">
                    <input type="email"
                           name="email"
                           value={this.state.input.email}
                           onChange={this.handleEmailInputChange}
                           placeholder="E-Mail"
                           required
                           translate-attr="{ placeholder: 'FORM_EMAIL_PLACEHOLDER'}"/>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns form-controls-termsofservice">
                  <label className="acceptTOSContainer" form-group="termsOfServiceAccepted">

                    <input type="checkbox"
                           name="termsOfServiceAccepted"
                           checked={this.state.input.termsOfServiceAccepted}
                           onChange={this.handleTermsOfServiceAcceptedInputChange}
                           required/>
                    <div>
                      {
                        this.state.errors.termsOfServiceAccepted ?
                          <span className="invalid-label">
                                              {
                                                this.state.errors.termsOfServiceAccepted.map(error => {
                                                  return <span key={error}>
                                                    {
                                                      error === 'FORM_AGB_ERROR_REQUIRED' ?
                                                        <Trans id={error} values={{
                                                          link: <a className='crowd-tos-link'
                                                                         onClick={this.toggleTerms}>
                                                            <Trans id='FORM_AGB_LABEL_LINK'>Nutzungsbedingung</Trans>
                                                          </a>
                                                        }}/>

                                                        : <Trans id={error}/>
                                                    }


                                                  </span>
                                                })
                                              }
                                            </span>
                          : <span className="valid-label">
                                                    <Trans id='FORM_AGB_LABEL'
                                                           values={{
                                                             link:
                                                               <a className='crowd-tos-link'
                                                                        onClick={this.toggleTerms}>
                                                                 <Trans id='FORM_AGB_LABEL_LINK'>Nutzungsbedingung</Trans>
                                                               </a>
                                                           }}/>
                                                    </span>
                      }
                    </div>
                  </label>
                </div>
              </div>

              {
                this.state.showTermsOfService ?
                  <div className="row">
                    <div className="small-12 columns">
                      <div className="acceptTOSPanel" translate="REGISTER_AGB">Hiermit gestatte ich der Axel Springer Ideas Engineering GmbH mich für Neuigkeiten (bspw. Start einer Kampagne sowie Status meiner Idee) rund um AS.Crowd zu kontaktieren. Ich habe die Möglichkeit mich jederzeit vom Newsletter abzumelden. Dazu kann ich den Link in der Fußzeile unserer E-Mails betätigen. Weitere Informationen zum Datenschutz sind der Datenschutzerklärung zu entnehmen.</div>
                    </div>
                  </div>
                  : null
              }


              <div className="row">
                <div className="small-12 columns text-center">
                  <div>
                    {
                      this.state.loading ?
                        <button className="button-primary" disabled translate="BUTTON_LABEL_REGISTERING">Registrieren...</button>
                        :
                        <button className="button-primary" onClick={this.signUp} translate="BUTTON_LABEL_REGISTER">Registrieren</button>
                    }
                  </div>
                  <div className="text--small push--top">
                    <Trans id='REGISTER_LOGIN' values={{link: <NavLink to='/signup'><Trans id='LOGIN_REGISTER_LINK'/></NavLink>}}/>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </content-row>
      </React.Fragment>
    );
  };
};
