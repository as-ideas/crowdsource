import React from "react";
import {NavLink} from "react-router-dom";
import {t} from "@lingui/macro"
import {Trans} from '@lingui/macro';
import {I18n} from "@lingui/react";
import {AuthContextConsumer} from "../../contexts/AuthContext";
import PageMeta from "../../layout/PageMeta";

export default class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      input: {email: "", password: ""},
    };

    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
  }

  componentDidMount() {
  }


  handleEmailInputChange(e) {
    this.state.input.email = e.target.value;
    console.log("Email: " + e.target.value)
    //this.setState(this.state, this.validateForm);
  }

  handlePasswordInputChange(e) {
    this.state.input.password = e.target.value;
    //this.setState(this.state, this.validateForm);
  }


  render() {
    return (
      <AuthContextConsumer>
        { ({ isLoading, login, errors }) => (
      <React.Fragment>
        <I18n>
          {({ i18n }) => (
            <PageMeta title={i18n._(t("NAV_LABEL_LOGIN")`Login`)} />
          )}
        </I18n>
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
                  errors.general ?
                    <div className="general-error alert-box alert">
                      {
                        errors.general.map(error => {
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
                      errors.email ?
                        <span className="invalid-label">
                                              {
                                                errors.email.map(error => {
                                                  return <span key={error}><Trans id={error}/></span>
                                                })
                                              }
                                            </span>
                        : <span className="valid-label"><Trans id='FORM_EMAIL_LABEL'>E-Mail</Trans></span>
                    }
                  </label>

                  <div className="full-width">
      <I18n>
      {({ i18n }) => (
                    <input type="email"
                           name="email"
                           onChange={this.handleEmailInputChange}
                           placeholder={i18n._(t`FORM_EMAIL_PLACEHOLDER`)}
                           required/>
  )}
  </I18n>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns form-controls-password">
                  <label form-group="password">


                    {
                      errors.password ?
                        <span className="invalid-label">
                                                {
                                                  errors.password.map(error => {
                                                    return <div key={error}><span><Trans id={error}/></span></div>
                                                  })
                                                }
                                            </span>
                        : <span className="valid-label"><Trans id='FORM_PASSWORD_LABEL'>Passwort</Trans></span>
                    }
  <I18n>
    {({ i18n }) => (
                    <input type="password"
                           name="password"
                           placeholder={i18n._(t`FORM_PASSWORD_PLACEHOLDER`)}
                           onChange={this.handlePasswordInputChange}
                           required/>
  )}
  </I18n>
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns text-center">
                  <div>
                    {
                      isLoading ?
                        <button className="button-primary" disabled><Trans id='BUTTON_LABEL_LOGGING_IN'>Login...</Trans></button>
                        :
                        <button className="button-primary" onClick={() => login(this.state.input.email, this.state.input.password)}><Trans id='BUTTON_LABEL_LOGIN'>Login</Trans></button>
                    }
                  </div>
                  <div className="text--small push--top">
                    <Trans id='LOGIN_REGISTER' values={{link: <NavLink to='/signup'><Trans id='LOGIN_REGISTER_LINK'/></NavLink>}}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </content-row>
      </React.Fragment>
        )}
    </AuthContextConsumer>
    );
  };
};
