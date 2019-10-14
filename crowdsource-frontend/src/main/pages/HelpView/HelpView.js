import React from 'react'
import './HelpView.scss'
import {Helmet} from "react-helmet";
import {I18n} from "@lingui/react"
import {Trans, t} from '@lingui/macro';
import AccordionComponent from "../../layout/AccordionComponent";

export default class HelpView extends React.Component {

  componentDidMount() {
  }

  render() {

    var numberOfItems = 22;
    var accordionList = [];

    for (var i = 1; i <= numberOfItems; i++) {
      const titleString = "AS_SUPPORT_FAQ_ACCORDION_ITEM_" + i + "_HEADLINE";
      const contentString = "AS_SUPPORT_FAQ_ACCORDION_ITEM_" + i + "_PARAGRAPH";

      accordionList.push(
        <AccordionComponent title={<Trans id={titleString}/>} key={titleString}>
          <I18n>
            {({ i18n }) => (
              <div dangerouslySetInnerHTML={{__html: i18n._(contentString)}} />
            )}
          </I18n>
        </AccordionComponent>
      )
    }

    return (
      <div className="content" data-ng-view="" autoscroll="true">
        <I18n>
          {({i18n}) => (
            <Helmet>
              <title>{i18n._(t("NAV_LABEL_HELP")`Übersicht`)}</title>
            </Helmet>
          )}
        </I18n>
        <div className="teaser--slim"></div>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <content-hero className="ng-scope ng-isolate-scope">
              <div className="content-hero__container">
                <h2 className="ng-binding content-hero__headline--solo">
                  <Trans id="AS_SUPPORT_HELP_HEADLINE">Hilfe</Trans>
                </h2>
                <p className="content-hero__description ng-binding"></p>
              </div>
            </content-hero>

            <I18n>
              {({ i18n }) => (
                <p translate-value-email="<a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>" className="ng-scope" dangerouslySetInnerHTML={{__html: i18n._("AS_SUPPORT_HELP_P1")}} />
              )}
            </I18n>

            <p className="ng-scope">
              <Trans id="AS_SUPPORT_HELP_P2">Wir versuchen in jedem Fall, eine Lösung für Dein Problem zu
                finden.</Trans>
            </p>
          </div>
        </content-row>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <content-hero className="ng-scope ng-isolate-scope">
              <div className="content-hero__container">
                <h2 className="ng-binding content-hero__headline--solo">
                  <Trans id="AS_SUPPORT_FAQ_HEADLINE">FAQ</Trans>
                </h2>
                <p className="content-hero__description ng-binding"></p>
              </div>
            </content-hero>

            <ul className="accordion flush">
              {accordionList}
            </ul>

          </div>
        </content-row>
      </div>
    )
  }

}
