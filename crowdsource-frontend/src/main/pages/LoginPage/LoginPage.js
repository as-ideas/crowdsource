import React from "react";
import TranslationService from "../../util/TranslationService";
import {NavLink} from "react-router-dom";


export default class LoginPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            errors: {}
        }
    }

    componentDidMount() {
    }

    login() {

    }

    // GENERAL ERRORS
    //<div ng-message="remote_bad_credentials"><span translate="LOGIN_ERROR_INVALID_CREDENTIALS"></span></div>
    //<div ng-message="remote_unknown"><span translate="FORM_ERROR_UNEXPECTED"></span></div>

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

                <div className="login-form">
                    <form name="login.form" className="box" noValidate>
                        <div className="row">
                            <div className="small-12 columns">
                                <h1>
                                    {TranslationService.translate('LOGIN_HEADLINE')}
                                    <small className="right push--top">
                                        <NavLink className="text--small" to="/login/password-recovery" translate="LOGIN_LINK_PASSWORD_RECOVERY">Passwort vergessen?</NavLink>
                                    </small>
                                </h1>
                            </div>
                        </div>

                        <div className="small-12 columns">
                            {
                                this.state.errors.general ?
                                    <div className="general-error alert-box alert" ng-messages="login.generalErrors">
                                        {/* FIXME add this.state.errors.general*/}
                                    </div>
                                    : null
                            }

                        </div>

                        <div className="row">
                            <div className="small-12 columns form-controls-email">
                                <label form-group="email">

                                    <span form-label-valid="email" translate="FORM_EMAIL_LABEL">E-Mail</span>

                                    {
                                        this.state.errors.email ?
                                            <span>
                                                {/* FIXME add this.state.errors.email*/}
                                            </span>
                                            : null
                                    }
                                </label>

                                <div className="full-width">
                                    <input type="email" name="email" placeholder="E-Mail" required
                                           translate-attr="{ placeholder: 'FORM_EMAIL_PLACEHOLDER'}"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="small-12 columns form-controls-password">
                                <label form-group="password">

                                    <span translate="FORM_PASSWORD_LABEL">Passwort</span>

                                    {
                                        this.state.errors.password ?
                                            <span>
                                                {/* FIXME add this.state.errors.password*/}
                                            </span>
                                            : null
                                    }

                                    <input type="password" name="password" placeholder="Passwort"
                                           required translate-attr="{ placeholder: 'FORM_PASSWORD_PLACEHOLDER' }"/>
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="small-12 columns text-center">
                                <div>
                                    {
                                        this.state.loading ?
                                            <button type="submit" className="button-primary" disabled translate="BUTTON_LABEL_LOGGING_IN">Login...</button>
                                            :
                                            <button type="submit" className="button-primary" onClick={this.login} translate="BUTTON_LABEL_LOGIN">Login</button>
                                    }


                                </div>
                                <div className="text--small push--top" translate="LOGIN_REGISTER">
                                    {/* FIXME react needs to be translated*/}
                                    Oder <a href='#/signup' translate='LOGIN_REGISTER_LINK'>hier</a> registrieren
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    };
};
