import React from "react";
import {NavLink}from 'react-router-dom';
import RoutingService from "../util/RoutingService";
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
                            <li><NavLink className="footer-link" to="/intro" translate="AS_FOOTER_LINK_INTRO">Entdecken</NavLink></li>
                            <li><NavLink className="footer-link" to="/help" translate="AS_FOOTER_LINK_SUPPORT">Hilfe</NavLink></li>
                            <AuthContextConsumer>
                            { ({ isAdmin }) => (
                                isAdmin ?
                                <React.Fragment>
                                  <li className="footer__item-head--nextrow">Admin</li>
                                  <li><NavLink className="footer-link" to="/statistics">Statistik</NavLink></li>
                                </React.Fragment>
                                : null
                            )}
                            </AuthContextConsumer>
                        </ul>
                        <ul className="footer__col">
                            <li className="footer__item-head" translate="AS_FOOTER_INFORMATION">Informationen</li>
                            <li><NavLink className="footer-link" to="/about" translate="AS_FOOTER_LINK_ABOUT_US">Über uns</NavLink></li>
                            <li><NavLink className="footer-link" to="/imprint" translate="AS_FOOTER_LINK_IMPRINT">Impressum</NavLink></li>
                            <li><NavLink className="footer-link" to="/privacy" translate="AS_FOOTER_LINK_PRIVACY_POLICY">Datenschutzerklärung</NavLink></li>
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
