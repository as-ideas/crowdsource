import React from "react";
import IdeaService from "../../util/IdeaService";
import IdeasEditComponent from "./IdeasEditComponent";
import PropTypes from "prop-types";
import Events from "../../util/Events";
import {i18n, translate} from "../../contexts/I18nContext";


export default class IdeaEdit extends React.Component {
  static propTypes = {
    idea: PropTypes.object,
    campaign: PropTypes.object,
    finishedCallback: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    console.info(this.props.idea);
  }

  submit(idea) {

    return IdeaService.updateIdea(this.props.campaign.id, idea)
      .then((result) => {
        if (!result.errorCode) {
          Events.emitEvent('VOTE_' + idea.id, {type: 'success', message: translate('IDEA_UPDATE_MESSAGE')});
          this.props.finishedCallback();
        } else {
          console.info("ERROR", result);
        }
        return result;
      })
      .catch(console.error);
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
      <IdeasEditComponent idea={this.props.idea}
                          campaign={this.props.campaign}
                          cancelCallback={this.cancel.bind(this)}
                          submitCallback={this.submit.bind(this)}/>
    )
  };
};
