import React from "react";
import TextFormatService from "../../util/TextFromatService";
import {Trans} from "@lingui/macro";
import TranslationService from "../../util/TranslationService";

//
// <style>
//   video {background: transparent url('{ campaign.contentI18n[vm.currentLanguage].videoImageReference }') 50% 50% / cover no-repeat; }
//   </style>

export default class IdeaTeaser extends React.Component {
  render() {
    let campaign = this.props.campaign ? this.props.campaign : {};
    let currentLanguage = TranslationService.getCurrentLanguage();
    let trustedDescriptionHtml = campaign.contentI18n[currentLanguage].description;

    return (
      <idea-teaser>
        <div className="ideas-teaser">
          <div className="ideas-teaser__content">
            <div className="ideas-teaser__container">
              <div className="ideas-teaser__item">
                <div className="ideas-teaser__video-container">

                  <video className="ideas-teaser__video" poster={require("./transparent.png")} controls controlsList="nodownload">
                    <source src={campaign.contentI18n[currentLanguage].videoReference} type="video/mp4"/>
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="ideas-teaser__description--mobile" dangerouslySetInnerHTML={{__html: trustedDescriptionHtml}}/>

              </div>
              <div className="ideas-teaser__item">
                <h1 className="ideas-teaser__heading">{campaign.contentI18n[currentLanguage].title}</h1>
                <p className="ideas-teaser__sponsor">{campaign.sponsor}</p>
                <p className="ideas-teaser__date">
                  {TextFormatService.shortDate(campaign.startDate)} - {TextFormatService.shortDate(campaign.endDate)}
                  {
                    campaign.expired ?
                      <span><Trans id='CAMPAIGN_LABEL_ENDED'> (beendet)</Trans></span>
                      : null
                  }
                </p>
                <p className="ideas-teaser__description" dangerouslySetInnerHTML={{__html: trustedDescriptionHtml}}/>
              </div>
            </div>
          </div>
        </div>
      </idea-teaser>
    )
  };
};
