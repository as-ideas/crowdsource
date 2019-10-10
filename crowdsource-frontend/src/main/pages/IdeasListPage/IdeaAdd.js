import React from "react";
import ContentHero from "../../layout/ContentHero";
import IdeaService from "../../util/IdeaService";
import IdeasEditComponent from "./IdeasEditComponent";


const EMPTY_IDEA = {title: "", pitch: ""};

export default class IdeaAdd extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  submit(idea) {
    return IdeaService.createIdea(this.props.campaign.id, idea);
  }

  render() {
    return (
      <idea-add>
        <ContentHero title="IDEAS_ADD_HEADLINE" description="IDEAS_ADD_DESC"/>

        <div className="idea-add__container">
          <IdeasEditComponent idea={EMPTY_IDEA} submitCallback={this.submit.bind(this)}/>
        </div>
      </idea-add>
    )
  };
};
