import React from 'react'
import './PrivacyView.scss'
import { Trans } from '@lingui/macro';

export default class PrivacyView extends React.Component {

    render() {
        return (
          <div className="content ng-scope" data-ng-view="" autoscroll="true">
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
