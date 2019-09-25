import React from 'react'
import './ImprintView.scss'

export default class ImprintView extends React.Component {

  render () {
    return (
      <div class="content ng-scope" data-ng-view="" autoscroll="true">
        <div class="teaser--slim ng-scope"></div>
        <content-row class="imprint ng-scope">
          <div class="container" ng-transclude="">
            <h2 translate="AS_IMPRINT_HEADLINE" class="ng-scope">Imprint</h2>

            <h4 translate="AS_IMPRINT_PROVIDER" class="ng-scope">Provider</h4>
            <address translate="AS_IMPRINT_ADDRESS" class="ng-scope">Axel Springer Ideas Engineering GmbH<br/>A company of Axel Springer SE<br/>Axel-Springer-Strasse 65<br/>10888 Berlin</address>

            <h4 translate="AS_IMPRINT_CONTACT_HEADLINE" class="ng-scope">Contact Information</h4>
            <p translate="AS_IMPRINT_CONTACT_P" translate-value-email="<a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>" class="ng-scope">E-mail: <a href="mailto:crowd@asideas.de">crowd@asideas.de</a><br/>Phone: 030 - 2591 78100</p>

            <h4 translate="AS_IMPRINT_RESPONSIBLE_HEADLINE" class="ng-scope">Responsible for the content according to § 6 Abs.2 MDStV</h4>
            <p translate="AS_IMPRINT_RESPONSIBLE_P" class="ng-scope">Michael Alber<br/>COO<br/>Axel-Springer-Strasse 65<br/>10888 Berlin<br/><br/>District Court/Commercial Register<br/>Based in Berlin, District Court of Charlottenburg, HRB 138466 B<br/>VAT ID No. DE 287499537<br/>Executive Directors: Samir Fadlallah, Michael Alber</p>
            <br class="ng-scope" />
            <h4 translate="AS_IMPRINT_COPYRIGHTS_HEADLINE" class="ng-scope">&nbsp;</h4>
            <p translate="AS_IMPRINT_COPYRIGHTS_P" class="ng-scope">&nbsp;</p>

          </div>
        </content-row>
      </div>
    )
  }

}
