import React from 'react'
import './ImprintView.scss'
import {t, Trans} from '@lingui/macro';
import {I18n} from "@lingui/react";
import {Helmet} from "react-helmet";

export default class ImprintView extends React.Component {

  render () {
    return (
      <div className="content ng-scope" data-ng-view="" autoscroll="true">
      <I18n>
      {({ i18n }) => (
        <Helmet>
        <title>{i18n._(t("NAV_LABEL_IMPRINT")`Impressum`)}</title>
        </Helmet>
      )}
      </I18n>
        <div className="teaser--slim ng-scope"></div>
        <content-row className="imprint ng-scope">
          <div className="container" ng-transclude="">
            <h2 className="ng-scope"><Trans id="AS_IMPRINT_HEADLINE">Impressum</Trans></h2>

            <h4 className="ng-scope"><Trans id="AS_IMPRINT_PROVIDER">Anbieter</Trans></h4>

            <address className="ng-scope">
              <Trans id="AS_IMPRINT_ADDRESS">
                Axel Springer Ideas Engineering GmbH<br/>
                Ein Unternehmen der Axel Springer SE<br/>
                Axel-Springer-Straße 65<br/>
                10888 Berlin
              </Trans>
            </address>

            <h4 className="ng-scope"><Trans id="AS_IMPRINT_CONTACT_HEADLINE">Kontakt</Trans></h4>
            <p className="ng-scope">
              <Trans id="AS_IMPRINT_CONTACT_P" values={{email: <a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>}}>
                E-Mail: <a href="mailto:crowd@asideas.de">crowd@asideas.de</a><br/>
                Telefon: 030 - 2591 78100<br/>
              </Trans>
            </p>

            <h4 className="ng-scope">
              <Trans id="AS_IMPRINT_RESPONSIBLE_HEADLINE">
                Verantwortlich für den Inhalt nach § 6 Abs.2 MDStV
              </Trans>
            </h4>

            <p className="ng-scope">
              <Trans id="AS_IMPRINT_RESPONSIBLE_P">
                Michael Alber<br/>
                COO<br/>
                Axel-Springer-Straße 65<br/>
                10888 Berlin<br/>
                <br/>
                Amtsgericht/ Handelsregister<br/>
                Sitz Berlin, Amtsgericht Charlottenburg, HRB 138466 B<br/>
                USt-IdNr. DE 287499537<br/>
                Geschäftsführer: Samir Fadlallah, Michael Alber<br/>
              </Trans>
            </p>

            <br className="ng-scope" />

          </div>
        </content-row>
      </div>
    )
  }

}
