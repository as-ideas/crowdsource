import React from "react";
import {Helmet} from "react-helmet";
import {NavContextConsumer} from "../contexts/NavContext";


export default class PageMeta extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
    }

    render() {
      return (
        <NavContextConsumer>
          { ({ pageTitle, updatePageTitle }) => (
            <React.Fragment>
            {
              // TODO
              // This seems to still trigger a second render while in render cycle which leads to an warning on the console
              // One fix could be use state object and check if prop value did really change on update
              // Or call updatePageTitle on props update, not on render!
              pageTitle != this.props.title ? updatePageTitle(this.props.title) : null
            }
            <Helmet>
              <title>{ this.props.title }</title>
            </Helmet>
            </React.Fragment>

          )}
        </NavContextConsumer>
      )}
}
