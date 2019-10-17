import React from 'react'
import './HelpPage.scss'
import {I18n} from "@lingui/react"
import {Trans, t} from '@lingui/macro';
import AccordionComponent from "../../layout/AccordionComponent";
import PageMeta from "../../layout/PageMeta";

export default class HelpPage extends React.Component {

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
          {({ i18n }) => (
            <PageMeta title={i18n._(t("NAV_LABEL_HELP")`Hilfe`)} />
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

            <p className="ng-scope" >
              <Trans id='AS_SUPPORT_HELP_P1' values={{email: <a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>, teams: <a href='https://teams.microsoft.com/l/channel/19%3a5e30dd1c7dba4b6fb3e91d87f680d827%40thread.skype/Allgemein?groupId=818a67d1-bd8b-4a54-a87f-b6aff587732a&tenantId=a1e7a36c-6a48-4768-9d65-3f679c0f3b12'>Microsoft Teams</a>}}/>
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
