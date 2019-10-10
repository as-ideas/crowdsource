import React from "react";
import IdeaService from "../../util/IdeaService";
import IdeasEditComponent from "./IdeasEditComponent";


export default class IdeaEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  submit(idea) {
    return IdeaService.createIdea(this.props.campaign.id, idea);
  }

  cancel() {
    // this.input.idea.contentI18n.original.title = vm.resetTitle;
    // this.input.idea.contentI18n.original.pitch = vm.resetPitch;
    // $scope.cancelFn();
    // reset: {
    //   title: this.props.idea.contentI18n != null ? this.props.idea.contentI18n.original.title : '',
    //     pitch: this.props.idea.contentI18n != null ? this.props.idea.contentI18n.original.pitch : '',
    // }
  }

  render() {
    return (
      <IdeasEditComponent idea={EMPTY_IDEA} cancelCallback={this.cancel.bind(this)} submitCallback={this.submit.bind(this)}/>
    )
  };
};
