import React from 'react'
import './ImprintView.scss'
import { Trans } from '@lingui/macro';

export default class ImprintView extends React.Component {

  render () {
    return (
      <div className="content ng-scope" data-ng-view="" autoscroll="true">
        <div className="teaser--slim ng-scope"></div>
        <content-row className="imprint ng-scope">
          <div className="container" ng-transclude="">
            <h2 className="ng-scope"><Trans id="AS_IMPRINT_HEADLINE" /></h2>

            <h4 className="ng-scope"><Trans id="AS_IMPRINT_PROVIDER" /></h4>
            <address className="ng-scope"><Trans id="AS_IMPRINT_ADDRESS" /></address>

            <h4 className="ng-scope"><Trans id="AS_IMPRINT_CONTACT_HEADLINE" /></h4>
            <p translate-value-email="<a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>" className="ng-scope"><Trans id="AS_IMPRINT_CONTACT_P" /></p>

            <h4 className="ng-scope"><Trans id="AS_IMPRINT_RESPONSIBLE_HEADLINE" /></h4>
            <p className="ng-scope"><Trans id="AS_IMPRINT_RESPONSIBLE_P" /></p>
            <br className="ng-scope" />
            <h4 className="ng-scope"><Trans id="AS_IMPRINT_COPYRIGHTS_HEADLINE" /></h4>
            <p className="ng-scope"><Trans id="AS_IMPRINT_COPYRIGHTS_P" /></p>

          </div>
        </content-row>
      </div>
    )
  }

}
