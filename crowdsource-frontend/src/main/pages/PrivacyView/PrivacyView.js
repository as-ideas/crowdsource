import React from 'react'
import './PrivacyView.scss'
import {t, Trans} from '@lingui/macro';
import {I18n} from "@lingui/react";
import {Helmet} from "react-helmet";

export default class PrivacyView extends React.Component {

    render() {
        return (
          <div className="content ng-scope" data-ng-view="" autoscroll="true">
          <I18n>
          {({ i18n }) => (
            <Helmet>
            <title>{i18n._(t("NAV_LABEL_PRIVACY")`Datenschutzerklärung`)}</title>
            </Helmet>
          )}
          </I18n>
            <div className="teaser--slim ng-scope"></div>
            <content-row className="privacy ng-scope">
              <div className="container" ng-transclude="">
                <div className="ng-scope">
                  <Trans id="AS_PRIVACY_POLICY_HTML" />
                </div>
              </div>
            </content-row>
          </div>
        )
    }
}
