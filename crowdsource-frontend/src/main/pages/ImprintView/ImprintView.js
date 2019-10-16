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

            <I18n>
              {({ i18n }) => (
                <address className="ng-scope" dangerouslySetInnerHTML={{__html: i18n._("AS_IMPRINT_ADDRESS")}} />
              )}
            </I18n>

            <h4 className="ng-scope"><Trans id="AS_IMPRINT_CONTACT_HEADLINE">Kontakt</Trans></h4>

            <I18n>
              {({ i18n }) => (
                <p className="ng-scope" dangerouslySetInnerHTML={{__html: i18n._("AS_IMPRINT_CONTACT_P")}} />
              )}
            </I18n>

            <h4 className="ng-scope">
              <Trans id="AS_IMPRINT_RESPONSIBLE_HEADLINE">
                Verantwortlich für den Inhalt nach § 6 Abs.2 MDStV
              </Trans>
            </h4>

            <I18n>
              {({ i18n }) => (
                <p className="ng-scope" dangerouslySetInnerHTML={{__html: i18n._("AS_IMPRINT_RESPONSIBLE_P")}} />
              )}
            </I18n>

            <br className="ng-scope" />

          </div>
        </content-row>
      </div>
    )
  }

}
