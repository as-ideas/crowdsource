import React from "react";
import TranslationService from "../../util/TranslationService";
import {NavLink} from "react-router-dom";
import AuthService from "../../util/AuthService";
import UserService from "../../util/UserService";
import RoutingService from "../../util/RoutingService";


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
        this.state.input.termsOfServiceAccepted = e.target.value;
        this.setState(this.state, this.validateForm);
    }

    backendErrorCodeToLabel(errorCode) {
        if (errorCode === "remote_unknown") {
            return "FORM_ERROR_UNEXPECTED";
        } else {
            return errorCode;
        }
    }

    signUp() {
        if (this.validateForm()) {
            this.state.errors.general = [];

            let user = this.state.input;
            UserService.register(user)
                .then(() => {
                    RoutingService.goToSuccessPageForUser(user);
                })
                .catch((errorCode) => {
                    this.state.errors.general = [this.backendErrorCodeToLabel(errorCode)];
                    this.setState(this.state);
                })
                .finally(() => {
                    this.setState({loading: false});
                });
        } else {
            console.error("Invalid form!");
        }
    }

    validateForm() {

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
                <div className='teaser--slim'/>

                <content-row className="signup-form">
                    <div className="container">
                        <div name="signup.form" className="box">

                            <div className="row">
                                <div className="small-12 columns">
                                    <h1 translate="REGISTER_HEADLINE">Registrierung</h1>
                                </div>
                            </div>


                            {
                                this.state.errors.general ?
                                    <div className="general-error alert-box alert" ng-messages="login.generalErrors">
                                        {
                                            this.state.errors.general.map(error => {
                                                return <span key={error}>{TranslationService.translate(error)}</span>
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
                                                      return <span key={error}>{TranslationService.translate(error)}</span>
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
                                                      return <span key={error}>{TranslationService.translate(error)}</span>
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
                                                      return <span key={error}>{TranslationService.translate(error)}</span>
                                                  })
                                              }
                                            </span>
                                                : <span className="valid-label" translate="FORM_EMAIL_LABEL">E-Mail</span>
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
                                               value={this.state.input.termsOfServiceAccepted}
                                               onChange={this.handleTermsOfServiceAcceptedInputChange}
                                               required/>
                                        <div>
                                            {
                                                this.state.errors.termsOfServiceAccepted ?
                                                    <span className="invalid-label">
                                              {
                                                  this.state.errors.termsOfServiceAccepted.map(error => {
                                                      return <span key={error}>{TranslationService.translate(error)}</span>
                                                  })
                                              }
                                            </span>
                                                    : <span className="valid-label" translate="FORM_AGB_LABEL">
                                                   Bitte akzeptiere die <a className='crowd-tos-link' onCick={this.toggleTerms} translate='FORM_AGB_LABEL_LINK'>Nutzungsbedingung</a></span>
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
                                    <div className="text--small push--top" translate="REGISTER_LOGIN" translate-compile translate-value-link="<a href='#/login' translate='REGISTER_LOGIN_LINK'></a>"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </content-row>
            </React.Fragment>
        );
    };
};
