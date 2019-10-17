import React from 'react'
import './PrivacyPage.scss'
import {t} from '@lingui/macro';
import {I18n} from "@lingui/react";
import PageMeta from "../../layout/PageMeta";

export default class PrivacyPage extends React.Component {

  render() {
    return (
      <div className="content ng-scope" data-ng-view="" autoscroll="true">
        <I18n>
          {({i18n}) => (
            <PageMeta title={i18n._(t("NAV_LABEL_PRIVACY")`Datenschutzerklärung`)}/>
          )}
        </I18n>
        <div className="teaser--slim ng-scope"></div>
        <content-row className="privacy ng-scope">
          <div className="container" ng-transclude="">
            <I18n>
              {({i18n}) => (
                <div className="ng-scope" dangerouslySetInnerHTML={{__html: i18n._("AS_PRIVACY_POLICY_HTML")}}/>
              )}
            </I18n>
          </div>
        </content-row>
      </div>
    )
  }
}
