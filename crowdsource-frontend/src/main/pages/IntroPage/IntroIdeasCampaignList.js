import React from "react";
import TextFormatService from "../../resources/util/TextFromatService";


export default class IntroIdeasCampaignList extends React.Component {
    render() {
        return (
            <React.Fragment>
                {
                    !this.props.list.entries.length ?
                        <div className="campaign-noentry">
                            <img className="campaign-noentry__image" src="/images/campaigns-not-available-robot.svg"/>
                            <span className="campaign-noentry__description" translate="OVERVIEW_IDEAS_NO_CAMPAIGN">Zurzeit gibt es leider keine Ideen Kampagne</span>
                        </div>
                        : null
                }
                {
                    this.props.list.entries.length ?
                        <div className="campaign-list__container">
                            {
                                this.props.list.entries.length.map(entry => {
                                    return <div className="campaign__container">
                                        <a href={'#/ideas/' + entry.id}>
                                            <article className="campaign__item">
                                                <div className="campaign__image-container">
                                                    <img className="campaign__image" src={entry.contentI18n[this.props.list.currentLanguage].teaserImageReference}/>
                                                </div>

                                                <div className="campaign__details-container">
                                                    <h1 className="campaign__title">{entry.contentI18n[this.props.list.currentLanguage].title}</h1>
                                                    <p className="campaign__sponsor">{entry.sponsor}</p>
                                                    <p className="campaign__date">{TextFormatService.shortDate(entry.startDate)} - {TextFormatService.shortDate(entry.endDate)}
                                                        {
                                                            entry.expired ?
                                                                <span translate="CAMPAIGN_LABEL_ENDED"> (beendet)</span>
                                                                : null
                                                        }
                                                    </p>
                                                </div>
                                            </article>
                                        </a>
                                    </div>
                                })
                            }
                        </div>
                        : null
                }
            </React.Fragment>
        )
    };
};
