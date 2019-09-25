import React from 'react'
import './AboutView.scss'
import teamfoto from './teamfoto.jpg'

export default class AboutView extends React.Component {

  render() {
    return (
        <div class="content ng-scope" data-ng-view="" autoscroll="true">
          <div class="teaser--slim ng-scope"></div>

          <content-row class="ng-scope">
            <div class="container" ng-transclude="">
              <img src={teamfoto} width="100%" class="ng-scope" />
              <p class="about__image-caption ng-scope" translate="AS_ABOUT_TEAM_CAPTION">from left: Tarek Madany Mamlouk, Martin Bild, Johannes Schrade, Anneke Möhlmann, Jasmin Heumann, Thomas Eisermann, Christian Sell, Julian Godesa, Max Weber, Lars Reith, Thomas Wendzinski, Johannes Burr, Sven Rebbert</p>
            </div>
          </content-row>

          <content-row class="ng-scope">
            <div class="container" ng-transclude="">
              <div class="about__container ng-scope">
                <div class="about__item">
                  <h2 class="about__headline ng-scope" translate="AS_ABOUT_IDEAS_ENGINEERING_HEADLINE">Ideas Engineering</h2>
                  <p class="about__text ng-scope" translate="AS_ABOUT_IDEAS_ENGINEERING_DESC">We focus on the development of new products. In order to gain a better understanding of the rapidly developing markets, we target the latest technology phenomena such as VR, AI, Chatbots, Big Data and Blockchain. We also consider ourselves as an incubator for digital and innovative products regarding business challenges of the Axel Springer family. And way beyond.<br/><br/>The aim of actively shaping the Axel Springer Group with our knowledge is not only shown by Axel Springer Crowd.<br/><br/>You want to get to know other innovative products? Let's grab a cup of coffee and have a chat.</p>
                  <p class="about__text">Dass wir mit unserem Wissen den Konzern aktiv mitgestalten wollen, zeigt nicht nur AS.Crowd.</p>
                  <p class="about__text">Du willst andere innovative Produkte kennenlernen? Komm mit uns bei einer guten Tasse Kaffee ins Gespräch.</p>
                  <social-links class="about__social-links--left" website="hhttps://axelspringerideas.de/" twitter="https://www.twitter.com/as_ideas" facebook="https://www.facebook.com/AxelSpringerIdeas" instagram="https://www.instagram.com/ideas_engineering"></social-links>
                </div>
              </div>
            </div>
          </content-row>

          <content-row class="ng-scope">
            <div class="container" ng-transclude="">
              <div class="about__container ng-scope">
                <div class="about__item">
                  <h2 class="about__headline ng-scope" translate="AS_ABOUT_PEOPLE_AND_CULTURE_HEADLINE">People &amp; Culture</h2>
                  <p class="about__text ng-scope" translate="AS_ABOUT_PEOPLE_AND_CULTURE_DESC">People &amp; Culture stands for company-wide networking and exchange among employees, for lifelong learning and the increase of potential of teams and each individual as well as for experiencing modern work. We are passionately committed to bring new impulses and innovations into the company that encourage our enthusiasm for new things.</p>
                </div>
              </div>
            </div>
          </content-row>

          <content-row class="ng-scope">
            <div class="container" ng-transclude="">
              <div class="about__container ng-scope">
                <div class="about__item">
                  <h2 class="about__headline ng-scope" translate="AS_ABOUT_AS_IT_HEADLINE">AS IT</h2>
                  <p class="about__text ng-scope" translate="AS_ABOUT_AS_IT_HEADLINE_DESC">At Axel Springer IT, we focus on recognizing the potential of digital transformation and disruptive technologies and making them available to the various business units of the Axel Springer family. Digital disruption is omnipresent and exposes us to strong competition in many areas of our daily work. At the same time, it offers us unexpected opportunities that we actively want to shape. These developments range from future-oriented technologies, over advantages through the use of data to groundbreaking trends in collaboration between employees. We support our customers in successfully mastering their daily challenges in the market so that we can further strengthen and expand our leading position as a digital publishing house. With our expertise we want to support the Axel Springer Crowd effectively.</p>
                  <social-links class="about__social-links--left" website="https://moveoffice.sharepoint.com/sites/b71"></social-links>
                </div>
              </div>
            </div>
          </content-row>

          <content-row class="ng-scope">
            <div class="container" ng-transclude="">
              <div class="about__container ng-scope">
                <div class="about__item">
                  <h2 class="about__headline ng-scope" translate="AS_ABOUT_NEWS_MEDIA_PRINT_HEADLINE">News Media Print</h2>
                  <p class="about__text ng-scope" translate="AS_ABOUT_NEWS_MEDIA_PRINT_DESC">The human resources department of the News Media Print division accompanies all employees with competence, experience and foresight on their journey through the Axel Springer family. From their application, parental leave, sabbatical and specialist career to retirement.<br/><br/>As creativity and exchange are the cornerstones of our work, we support Axel Springer Crowd.</p>
                  <p class="about__text">Weil Kreativität und Austausch Grundpfeiler unserer Arbeit sind, unterstützen wir AS.Crowd.</p>
                  <social-links class="about__social-links--left" website="https://moveoffice.sharepoint.com/sites/b60/SitePages/Home.aspx?e=1:56e0357a6aef4283a4fa96847a159e25"></social-links>
                </div>
              </div>
            </div>
          </content-row>
        </div>
      )
  };

};
