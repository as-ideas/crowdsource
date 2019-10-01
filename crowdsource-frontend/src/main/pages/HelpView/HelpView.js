import React from 'react'
import './HelpView.scss'
import {Helmet} from "react-helmet";
import { I18n } from "@lingui/react"
import { Trans,t } from '@lingui/macro';
//import {$, jQuery} from 'jquery';
import 'foundation-sites';
import Foundation from 'foundation-sites';
//import { Accordion, AccordionItem, AccordionTitle, AccordionContent } from 'react-foundation';
import { Accordion, AccordionItem, AccordionTitle, AccordionContent } from 'foundation-sites/js/foundation/foundation.accordion.js'

export default class HelpView extends React.Component {

  loadJsFile(filename){
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)

    if (typeof fileref!="undefined"){
      document.getElementsByTagName("head")[0].appendChild(fileref)
    }
  }




  componentDidMount() {
    console.log("load js")
//    this.loadJsFile("https://code.jquery.com/jquery-3.4.1.min.js")
//    this.loadJsFile("https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/js/foundation.min.js")
//    this.loadJsFile("https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/js/plugins/foundation.core.min.js")
//    this.loadJsFile("https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/js/plugins/foundation.util.mediaQuery.min.js")
//    this.loadJsFile("https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/js/plugins/foundation.accordion.min.js")
//    this.loadJsFile("https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/css/foundation.css")


    $(document).ready(function () {
      console.log("initialize foundation...")
//      Foundation.addToJquery($);
/*      $(document).foundation({
        equalizer: {
          // required to work with block grids
          equalize_on_stack: true
        }
      });
      console.log("foundation initialized")
*/
    });

  }









  render () {
    return (
      <div className="content ng-scope" data-ng-view="" autoscroll="true">
      <I18n>
      {({ i18n }) => (
        <Helmet>
        <title>{i18n._(t("NAV_LABEL_HELP")`Übersicht`)}</title>
        </Helmet>
      )}
      </I18n>
        <div className="teaser--slim ng-scope"></div>

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
              <Trans id="AS_SUPPORT_HELP_P1">Wenn Du ein Problem oder eine Frage hast, schau gern in unsere FAQ’s. Vielleicht kannst Du dort schon die passende Antwort finden. Solltest Du wirklich nicht weiterkommen, dann wende Dich gern direkt an uns: <a href="mailto:crowd@asideas.de">crowd@asideas.de</a> oder <a href="https://teams.microsoft.com/l/channel/19{2}a5e30dd1c7dba4b6fb3e91d87f680d827{39}thread.skype/Allgemein?groupId=818a67d1-bd8b-4a54-a87f-b6aff587732a&amp;tenantId=a1e7a36c-6a48-4768-9d65-3f679c0f3b12">Microsoft Teams</a></Trans>
            </p>
            <p className="ng-scope">
              <Trans id="AS_SUPPORT_HELP_P2">Wir versuchen in jedem Fall, eine Lösung für Dein Problem zu finden.</Trans>
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

              <accordion-item>
                  <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_1_HEADLINE">Was ist die Axel Springer Crowd?</Trans>
              </accordion-item>



              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-item">
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_1_HEADLINE">Was ist die Axel Springer Crowd?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_1_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-item">
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_2_HEADLINE">Wie kann ich mich bei Axel Springer Crowd registrieren?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_2_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_3_HEADLINE">Which Axel Springer companies can participate?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_3_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_4_HEADLINE">What is a marketplace?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_4_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_5_HEADLINE">What's the deal with the "One more idea" marketplace?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_5_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_6_HEADLINE">How often do new marketplaces appear?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_6_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_7_HEADLINE">Can I also submit ideas for a marketplace?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_7_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_8_HEADLINE">In which format do I submit ideas?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_8_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_9_HEADLINE">Why is the number of characters for an idea limited?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_9_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_10_HEADLINE">In which language should I submit my idea?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_10_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_11_HEADLINE">How is my idea translated and what is DeepL?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_11_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_12_HEADLINE">Can I edit my idea later on?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_12_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_13_HEADLINE">Who is releasing my idea?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_13_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_14_HEADLINE">Which rules apply to the release and rejection of an idea?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_14_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_15_HEADLINE">How long does take until my idea is released?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_15_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_16_HEADLINE">When can an idea be voted on?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_16_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_17_HEADLINE">Can I change my voting later on?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_17_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_18_HEADLINE">Who should I contact if I have any questions about a rejection?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_18_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_19_HEADLINE">How are the winners of a marketplace selected?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_19_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_20_HEADLINE">Do winners receive a reward or bonus?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_20_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_21_HEADLINE">Where can I find information about innovation?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_21_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_22_HEADLINE">In which countries is Axel Springer Crowd available?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_22_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
              <accordion-item className="ng-isolate-scope">
                <li className="accordion-navigation accordion-active" >
                  <a ng-click="accordion.showContent = !accordion.showContent" className="ng-binding">
                    <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_23_HEADLINE">On what Agreement is Axel Springer Crowd operated?</Trans>
                  </a>
                  <div className="content ng-scope" ng-transclude="" ng-if="accordion.showContent">
                    <p className="ng-scope">
                      <Trans id="AS_SUPPORT_FAQ_ACCORDION_ITEM_23_PARAGRAPH">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Trans>
                    </p>
                  </div>
                </li>
              </accordion-item>
            </ul>

          </div>
        </content-row>
      </div>
    )
  }

}
