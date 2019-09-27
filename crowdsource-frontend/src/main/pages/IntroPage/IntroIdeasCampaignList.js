import React from "react";
import TextFormatService from "../../util/TextFromatService";
import IdeaService from "../../util/IdeaService";
import {Trans} from '@lingui/macro';
import {NavLink} from "react-router-dom";


export default class IntroIdeasCampaignList extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {ideas: []};

  }

  componentDidMount() {
    IdeaService.getCampaigns()
      .then((response) => {
        this.setState({ideas: response});
      });
  }

  render() {
    return (
      <React.Fragment>
        {
          !this.state.ideas.length ?
            <div className="campaign-noentry">
              <img className="campaign-noentry__image" src={require("./campaigns-not-available-robot.svg")}/>
              <span className="campaign-noentry__description"><Trans id="OVERVIEW_IDEAS_NO_CAMPAIGN">Zurzeit gibt es leider keine Ideen Kampagne</Trans></span>
            </div>
            : <div className="campaign-list__container">
              {
                this.state.ideas.length.map(entry => {
                  return <div className="campaign__container">
                    <NavLink to={'/ideas/' + entry.id}>
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
                                <span><Trans id="CAMPAIGN_LABEL_ENDED"> (beendet)</Trans></span>
                                : null
                            }
                          </p>
                        </div>
                      </article>
                    </NavLink>
                  </div>
                })
              }
            </div>
        }
      </React.Fragment>
    )
  };
};
