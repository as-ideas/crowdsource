import React from "react";
import TextFormatService from "../../util/TextFromatService";
import {Trans} from "@lingui/macro";
import TranslationService from "../../util/TranslationService";


export default class IdeaTeaser extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.videoPlayerRef = React.createRef();
  }

  render() {
    let campaign = this.props.campaign ? this.props.campaign : {};
    let currentLanguage = TranslationService.getCurrentLanguage();

    let trustedDescriptionHtml = campaign.contentI18n ? campaign.contentI18n[currentLanguage].description : null;
    let videoReference = campaign.contentI18n ? campaign.contentI18n[currentLanguage].videoReference : null;
    let videoImageReference = campaign.contentI18n ? campaign.contentI18n[currentLanguage].videoImageReference : null;
    let title = campaign.contentI18n ? campaign.contentI18n[currentLanguage].title : null;

    // We need to reload the Video-Player if the source attribute did change
    if (videoReference) {
      let node = this.videoPlayerRef;
      if (node.current && node.current.load) {
        node.current.load();
      }
    }

    let videoStyle = {
      background: `transparent url('${videoImageReference}') 50% 50% / cover no-repeat`
    };

    return (
      <idea-teaser>
        <div className="ideas-teaser">
          <div className="ideas-teaser__content">
            <div className="ideas-teaser__container">
              <div className="ideas-teaser__item">
                <div className="ideas-teaser__video-container">

                  <video className="ideas-teaser__video"
                         ref={this.videoPlayerRef}
                         style={videoStyle}
                         poster={require("./transparent.png")}
                         controls
                         controlsList="nodownload">
                    <source src={videoReference} type="video/mp4"/>
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="ideas-teaser__description--mobile" dangerouslySetInnerHTML={{__html: trustedDescriptionHtml}}/>

              </div>
              <div className="ideas-teaser__item">
                <h1 className="ideas-teaser__heading">{title}</h1>
                <p className="ideas-teaser__sponsor">{campaign.sponsor}</p>
                <p className="ideas-teaser__date">
                  {TextFormatService.shortDate(campaign.startDate)} - {TextFormatService.shortDate(campaign.endDate)}
                  {
                    campaign.expired ?
                      <span>&nbsp;<Trans id='CAMPAIGN_LABEL_ENDED'> (beendet)</Trans></span>
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
