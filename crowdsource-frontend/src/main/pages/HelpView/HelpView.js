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

    var numberOfItems = 23;
    var accordionList = [];

    for (var i = 1; i <= numberOfItems; i++) {
      var titleString = "AS_SUPPORT_FAQ_ACCORDION_ITEM_" + i + "_HEADLINE";
      var contentString = "AS_SUPPORT_FAQ_ACCORDION_ITEM_" + i + "_PARAGRAPH";
      accordionList.push(
        <AccordionComponent title={<Trans id={titleString}/>}>
          <Trans id={contentString}></Trans>
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
            <p translate-value-email="<a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>" className="ng-scope">
              <Trans id="AS_SUPPORT_HELP_P1">Wenn Du ein Problem oder eine Frage hast, schau gern in unsere FAQ’s.
                Vielleicht kannst Du dort schon die passende Antwort finden. Solltest Du wirklich nicht weiterkommen,
                dann wende Dich gern direkt an uns: <a href="mailto:crowd@asideas.de">crowd@asideas.de</a> oder <a
                  href="https://teams.microsoft.com/l/channel/19{2}a5e30dd1c7dba4b6fb3e91d87f680d827{39}thread.skype/Allgemein?groupId=818a67d1-bd8b-4a54-a87f-b6aff587732a&amp;tenantId=a1e7a36c-6a48-4768-9d65-3f679c0f3b12">Microsoft
                  Teams</a></Trans>
            </p>
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
