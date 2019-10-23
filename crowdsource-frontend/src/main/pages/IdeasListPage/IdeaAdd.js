import React from "react";
import ContentHero from "../../layout/ContentHero";
import IdeaService from "../../util/IdeaService";
import IdeasEditComponent from "./IdeasEditComponent";
import Events from "../../util/Events";
import {Trans} from '@lingui/macro';


const EMPTY_IDEA = {title: "", pitch: ""};

export default class IdeaAdd extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  submit(idea) {
    return IdeaService.createIdea(this.props.campaign.id, idea)
      .then((newIdeaResponse) => {
        if (!newIdeaResponse.errorCode) {
          Events.emitEvent('UPDATE_OWN_STATISTICS');
          Events.emitEvent('ADD_IDEA_SUCCESS', {
            type: 'success',
            message: <Trans id="IDEA_ADD_MESSAGE_1"/> + '<br>' + 'IDEA_ADD_MESSAGE_2'
          });
        }
        return newIdeaResponse;
      })
      .catch(error => console.info("FEHLER BEI EMIT EVENT", error));
  }

  render() {
    return (
      <idea-add>
        <ContentHero title="IDEAS_ADD_HEADLINE" description="IDEAS_ADD_DESC"/>

        <div className="idea-add__container">
          <IdeasEditComponent idea={EMPTY_IDEA} campaign={this.props.campaign} submitCallback={this.submit.bind(this)}/>
        </div>
      </idea-add>
    )
  };
};
