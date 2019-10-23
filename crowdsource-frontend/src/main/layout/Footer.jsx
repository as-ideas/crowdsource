import React from "react";
import {NavLink} from 'react-router-dom';
import RoutingService from "../util/RoutingService";
import {AuthContextConsumer} from "../contexts/AuthContext";
import {Trans} from '@lingui/macro';

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
              <li className="footer__item-head"><Trans id="AS_FOOTER_PARTNER">Partner</Trans></li>
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
              <li className="footer__item-head"><Trans id="AS_FOOTER_SITEMAP">Sitemap</Trans></li>
              <li><NavLink className="footer-link" to="/intro"><Trans id="AS_FOOTER_LINK_INTRO">Entdecken</Trans></NavLink></li>
              <li><NavLink className="footer-link" to="/help"><Trans id="AS_FOOTER_LINK_SUPPORT">Hilfe</Trans></NavLink></li>
              <AuthContextConsumer>
                {({isAdmin}) => (
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
              <li className="footer__item-head" translate=""><Trans id="AS_FOOTER_INFORMATION">Informationen</Trans></li>
              <li><NavLink className="footer-link" to="/about"><Trans id="AS_FOOTER_LINK_ABOUT_US">Über uns</Trans></NavLink></li>
              <li><NavLink className="footer-link" to="/imprint"><Trans id="AS_FOOTER_LINK_IMPRINT">Impressum</Trans></NavLink></li>
              <li>
                <NavLink className="footer-link" to="/privacy"><Trans id="AS_FOOTER_LINK_PRIVACY_POLICY">Datenschutzerklärung</Trans></NavLink>
              </li>
            </ul>
            <ul className="footer__col">
              <li>
                <button className="button-primary" onClick={this.goToNewsletter}><Trans id="AS_BUTTON_LABEL_NEWSLETTER">Newsletter</Trans>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>)
  };
};
