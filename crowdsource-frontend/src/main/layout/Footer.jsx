import React from "react";
import RoutingService from "../util/RoutingService";
import AuthService from "../util/AuthService";
import Events from "../util/Events";
import {AuthContextConsumer} from "../contexts/AuthContext";


export default class Footer extends React.Component {

    goToNewsletter() {
        RoutingService.openExternal('http://eepurl.com/gglA8X');
    }

    render() {
        return (<footer>
            <div className="footer">
                <div className="row">
                    <div className="footer__container">
                        <ul className="footer__col">
                            <li className="footer__item-head" translate="AS_FOOTER_PARTNER">Partner</li>
                            <li>
                                <div className="footer-partner__container">
                                    <a href="https://www.asideas.de" target="_blank">
                                        <div className="footer-partner__ideas"/>
                                    </a>
                                    <a href="https://moveoffice.sharepoint.com/sites/peopleandculture" target="_blank">
                                        <div className="footer-partner__pc"/>
                                    </a>
                                    <a href="https://moveoffice.sharepoint.com/sites/b71" target="_blank">
                                        <div className="footer-partner__asdigitalists"/>
                                    </a>
                                </div>
                            </li>
                        </ul>
                        <ul className="footer__col">
                            <li className="footer__item-head" translate="AS_FOOTER_SITEMAP">Sitemap</li>
                            <li><a className="footer-link" href="/intro" translate="AS_FOOTER_LINK_INTRO">Entdecken</a></li>
                            <li><a className="footer-link" href="/help" translate="AS_FOOTER_LINK_SUPPORT">Hilfe</a></li>
                            <AuthContextConsumer>
                            { ({ isAdmin }) => (
                                isAdmin ?
                                <React.Fragment>
                                  <li className="footer__item-head--nextrow">Admin</li>
                                  <li><a className="footer-link" href="/statistics">Statistik</a></li>
                                </React.Fragment>
                                : null
                            )}
                            </AuthContextConsumer>
                        </ul>
                        <ul className="footer__col">
                            <li className="footer__item-head" translate="AS_FOOTER_INFORMATION">Informationen</li>
                            <li><a className="footer-link" href="/about" translate="AS_FOOTER_LINK_ABOUT_US">Über uns</a></li>
                            <li><a className="footer-link" href="/imprint" translate="AS_FOOTER_LINK_IMPRINT">Impressum</a></li>
                            <li><a className="footer-link" href="/privacy" translate="AS_FOOTER_LINK_PRIVACY_POLICY">Datenschutzerklärung</a></li>
                        </ul>
                        <ul className="footer__col">
                            <li>
                                <button className="button-primary" onClick={this.goToNewsletter} translate="AS_BUTTON_LABEL_NEWSLETTER">Newsletter</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>)
    };
};
