import React from 'react'
import './AboutView.scss'
import { Trans } from '@lingui/macro';
import teamfoto from './teamfoto.jpg'

export default class AboutView extends React.Component {

  render() {
    return (
        <div className="content ng-scope" data-ng-view="" autoscroll="true">
          <div className="teaser--slim ng-scope"></div>

          <content-row className="ng-scope">
            <div className="container" ng-transclude="">
              <img src={teamfoto} width="100%" className="ng-scope" />
              <p className="about__image-caption ng-scope"><Trans id='AS_ABOUT_TEAM_CAPTION' /></p>
            </div>
          </content-row>

          <content-row className="ng-scope">
            <div className="container" ng-transclude="">
              <div className="about__container ng-scope">
                <div className="about__item">
                  <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_IDEAS_ENGINEERING_HEADLINE" /></h2>
                  <p className="about__text ng-scope"><Trans id="AS_ABOUT_IDEAS_ENGINEERING_DESC" /></p>
                  <social-links className="about__social-links--left" website="hhttps://axelspringerideas.de/" twitter="https://www.twitter.com/as_ideas" facebook="https://www.facebook.com/AxelSpringerIdeas" instagram="https://www.instagram.com/ideas_engineering"></social-links>
                </div>
              </div>
            </div>
          </content-row>

          <content-row className="ng-scope">
            <div className="container" ng-transclude="">
              <div className="about__container ng-scope">
                <div className="about__item">
                  <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_PEOPLE_AND_CULTURE_HEADLINE" /></h2>
                  <p className="about__text ng-scope"><Trans id="AS_ABOUT_PEOPLE_AND_CULTURE_DESC" /></p>
                </div>
              </div>
            </div>
          </content-row>

          <content-row className="ng-scope">
            <div className="container" ng-transclude="">
              <div className="about__container ng-scope">
                <div className="about__item">
                  <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_AS_IT_HEADLINE" /></h2>
                  <p className="about__text ng-scope"><Trans id="AS_ABOUT_AS_IT_HEADLINE_DESC" /></p>
                  <social-links className="about__social-links--left" website="https://moveoffice.sharepoint.com/sites/b71"></social-links>
                </div>
              </div>
            </div>
          </content-row>

          <content-row className="ng-scope">
            <div className="container" ng-transclude="">
              <div className="about__container ng-scope">
                <div className="about__item">
                  <h2 className="about__headline ng-scope"><Trans id="AS_ABOUT_NEWS_MEDIA_PRINT_HEADLINE" /></h2>
                  <p className="about__text ng-scope"><Trans id="AS_ABOUT_NEWS_MEDIA_PRINT_DESC" /></p>
                  <social-links className="about__social-links--left" website="https://moveoffice.sharepoint.com/sites/b60/SitePages/Home.aspx?e=1:56e0357a6aef4283a4fa96847a159e25"></social-links>
                </div>
              </div>
            </div>
          </content-row>
        </div>
      )
  };

};
