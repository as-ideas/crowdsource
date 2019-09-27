import React from "react";
import {NavLink} from "react-router-dom";
import AuthService from "../../util/AuthService";
import {i18n} from "../../index"
import {t} from "@lingui/macro"
import {Trans} from '@lingui/macro';
import RoutingService from "../../util/RoutingService";
import ValidationService from "../../util/ValidationService";

export default class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      input: {email: "", password: ""},
      errors: {}
    };

    this.login = this.login.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
  }

  login() {
    if (this.validateForm()) {
      this.state.errors.general = [];
      AuthService.login(this.state.input.email, this.state.input.password)
        .then((response) => {
          if (response.errorCode) {
            this.state.errors = ValidationService.errorObjectFromBackend(response);
            this.setState(this.state);
          } else {
            RoutingService.redirectToOriginallyRequestedPageOr('/');
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

  handleEmailInputChange(e) {
    this.state.input.email = e.target.value;
    this.setState(this.state, this.validateForm);
  }

  handlePasswordInputChange(e) {
    this.state.input.password = e.target.value;
    this.setState(this.state, this.validateForm);
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

    if (!this.state.input.password) {
      this.state.errors.password = ['FORM_PASSWORD_ERROR_REQUIRED'];
    }

    this.setState(this.state);
    return this.isValidForm();
  }

  isValidForm() {
    return Object.keys(this.state.errors).length === 0;
  }

  // GENERAL ERRORS

  // EMAIL ERRORS
  // <div ng-message="required"><span translate="FORM_EMAIL_ERROR_REQUIRED"></span></div>
  // <div ng-message="email"><span translate="FORM_EMAIL_ERROR_INVALID"></span></div>
  // <div ng-message="remote_eligible"><span translate="FORM_EMAIL_ERROR_INVALID_UNIT"></span></div>
  // <div ng-message="non_blacklisted_email"><span translate="FORM_EMAIL_ERROR_INVALID_BLACKLIST"></span></div>
  // <div ng-message="remote_not_activated">
  //      <span translate="FORM_EMAIL_ERROR_ALREADY_ACTIVATED_1">
  //         <NavLink to="/passwordrecovery">{TranslationService.translate('FORM_EMAIL_ERROR_ALREADY_ACTIVATED_2')}</NavLink>
  //      </span>
  // </div>

  // PASSWORD ERRORS
  // <div ng-message="required"><span translate="FORM_PASSWORD_ERROR_REQUIRED"></span></div>
  render() {
    return (
      <React.Fragment>
        <div className='teaser--slim'/>

        <content-row className="login-form">
          <div className="container">
            <div className="box">
              <div className="row">
                <div className="small-12 columns">
                  <h1>
                    <Trans id='LOGIN_HEADLINE'/>
                    <small className="right push--top">
                      <NavLink className="text--small" to="/login/password-recovery"><Trans id='LOGIN_LINK_PASSWORD_RECOVERY'>Passwort vergessen?</Trans></NavLink>
                    </small>
                  </h1>
                </div>
              </div>

              <div className="small-12 columns">
                {
                  this.state.errors.general ?
                    <div className="general-error alert-box alert" ng-messages="login.generalErrors">
                      {
                        this.state.errors.general.map(error => {
                          return <span key={error}><Trans id={error}/></span>
                        })
                      }
                    </div>
                    : null
                }

              </div>

              <div className="row">
                <div className="small-12 columns form-controls-email">
                  <label form-group="email">
                    {
                      this.state.errors.email ?
                        <span className="invalid-label">
                                              {
                                                this.state.errors.email.map(error => {
                                                  return <span key={error}><Trans id={error}/></span>
                                                })
                                              }
                                            </span>
                        : <span className="valid-label"><Trans id='FORM_EMAIL_LABEL'>E-Mail</Trans></span>
                    }
                  </label>

                  <div className="full-width">
                    <input type="email"
                           name="email"
                           value={this.state.input.email}
                           onChange={this.handleEmailInputChange}
                           placeholder={i18n._(t`FORM_EMAIL_PLACEHOLDER`)}
                           required/>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns form-controls-password">
                  <label form-group="password">


                    {
                      this.state.errors.password ?
                        <span className="invalid-label">
                                                {
                                                  this.state.errors.password.map(error => {
                                                    return <div key={error}><span><Trans id={error}/></span></div>
                                                  })
                                                }
                                            </span>
                        : <span className="valid-label"><Trans id='FORM_PASSWORD_LABEL'>Passwort</Trans></span>
                    }

                    <input type="password"
                           name="password"
                           placeholder={i18n._(t`FORM_PASSWORD_PLACEHOLDER`)}
                           value={this.state.input.password}
                           onChange={this.handlePasswordInputChange}
                           required/>
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns text-center">
                  <div>
                    {
                      this.state.loading ?
                        <button className="button-primary" disabled><Trans id='BUTTON_LABEL_LOGGING_IN'>Login...</Trans></button>
                        :
                        <button className="button-primary" onClick={this.login}><Trans id='BUTTON_LABEL_LOGIN'>Login</Trans></button>
                    }
                  </div>
                  <div className="text--small push--top">
                    <Trans id='LOGIN_REGISTER' values={{link: <a href='#/signup'><Trans id='LOGIN_REGISTER_LINK'/></a>}}/>
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
