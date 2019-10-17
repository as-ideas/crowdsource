import React from 'react'
import './AboutView.scss'
import teamfoto from './teamfoto.jpg'
import {I18n} from "@lingui/react"
import {Trans, t} from '@lingui/macro';
import PageMeta from "../../layout/PageMeta";

export default class AboutView extends React.Component {

  render() {
    return (
      <div className="content ng-scope" data-ng-view="" autoscroll="true">
        <I18n>
          {({i18n}) => (
            <PageMeta title={i18n._(t("NAV_LABEL_ABOUT_US")`Über uns`)}/>
          )}
        </I18n>

        <div className="teaser--slim ng-scope"></div>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <img src={teamfoto} width="100%" className="ng-scope"/>
            <p className="about__image-caption ng-scope"><Trans id='AS_ABOUT_TEAM_CAPTION'>v.l.n.r. Tic, Tac,
              Toe</Trans></p>
          </div>
        </content-row>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <div className="about__container ng-scope">
              <div className="about__item">
                <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_IDEAS_ENGINEERING_HEADLINE">Ideas
                  Engineering</Trans></h2>
                <I18n>
                  {({i18n}) => (
                    <p className="about__text ng-scope"
                       dangerouslySetInnerHTML={{__html: i18n._("AS_ABOUT_IDEAS_ENGINEERING_DESC")}}/>
                  )}
                </I18n>
                <social-links className="about__social-links--left" website="hhttps://axelspringerideas.de/"
                              twitter="https://www.twitter.com/as_ideas"
                              facebook="https://www.facebook.com/AxelSpringerIdeas"
                              instagram="https://www.instagram.com/ideas_engineering"></social-links>
              </div>
            </div>
          </div>
        </content-row>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <div className="about__container ng-scope">
              <div className="about__item">
                <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_PEOPLE_AND_CULTURE_HEADLINE">People &
                  Culture</Trans></h2>
                <p className="about__text ng-scope"><Trans id="AS_ABOUT_PEOPLE_AND_CULTURE_DESC">People & Culture steht
                  für die unternehmensweite Vernetzung und den Austausch der Mitarbeiter untereinander, für lebenslanges
                  Lernen und die Potentialentfaltung von Teams und jedem Einzelnen sowie für das Erleben modernen
                  Arbeitens. Mit Leidenschaft setzen wir uns dafür ein, neue Impulse und Innovationen ins Unternehmen zu
                  tragen, die Lust auf Neues machen.</Trans></p>
              </div>
            </div>
          </div>
        </content-row>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <div className="about__container ng-scope">
              <div className="about__item">
                <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_AS_IT_HEADLINE">AS IT</Trans></h2>
                <p className="about__text ng-scope"><Trans
                  id="AS_ABOUT_AS_IT_HEADLINE_DESC">AS_ABOUT_AS_IT_HEADLINE_DESC</Trans></p>
                <social-links className="about__social-links--left"
                              website="https://moveoffice.sharepoint.com/sites/b71"></social-links>
              </div>
            </div>
          </div>
        </content-row>

        <content-row className="ng-scope">
          <div className="container" ng-transclude="">
            <div className="about__container ng-scope">
              <div className="about__item">
                <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_NEWS_MEDIA_PRINT_HEADLINE">News Media
                  Print</Trans></h2>
                <I18n>
                  {({i18n}) => (
                    <p className="about__text ng-scope"
                       dangerouslySetInnerHTML={{__html: i18n._("AS_ABOUT_NEWS_MEDIA_PRINT_DESC")}}/>
                  )}
                </I18n>
                <social-links className="about__social-links--left"
                              website="https://moveoffice.sharepoint.com/sites/b60/SitePages/Home.aspx?e=1:56e0357a6aef4283a4fa96847a159e25"></social-links>
              </div>
            </div>
          </div>
        </content-row>
      </div>
    )
  };

};
