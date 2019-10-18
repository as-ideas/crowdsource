import React from "react";
import {Helmet} from "react-helmet";
import {NavContext, NavContextConsumer} from "../contexts/NavContext";


export default class PageMeta extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.context.updateBreadcrumb(this.props.breadcrumb)
    this.context.updatePageTitle(this.props.title)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.breadcrumb != this.props.breadcrumb) {
      this.context.updateBreadcrumb(this.props.breadcrumb)
    }

    if (prevProps.title != this.props.title) {
      this.context.updatePageTitle(this.props.title)
    }
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
      </React.Fragment>
    )
  }
}
PageMeta.contextType = NavContext;

