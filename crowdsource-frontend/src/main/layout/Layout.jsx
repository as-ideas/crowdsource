import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import {Trans} from "@lingui/macro";

import "./Layout.scss";

export default class Layout extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {errors: []};
  }

  componentDidMount() {
    // window.onerror = (msg, src, lineno, colno, error) => {
    //   console.error("Global error!", msg, src, lineno, colno, error)
    // };
    window.addEventListener('unhandledrejection', this.handleUnhandledRejectionError.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejectionError)
  }

  handleUnhandledRejectionError(event) {
    console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
    try {
      this.setState({errors: ["Unhandled error: " + event.reason]});
      console.info("Added error");
    } catch (error) {
      console.error("Error in handleUnhandledRejectionError", error);
    }

  }

  // Will only be called for rendering errors
  componentDidCatch(error, info) {
    console.info("Layout componentDidCatch", error, info);
    this.setState({errors: [error]});
  }


  render() {
    console.info("Errors", this.state.errors.length);
    return (
      <React.Fragment>
        <div className="page-wrapper">
          <Header/>

          <div className="global-errors small-12 columns">
            {
              this.state.errors.length ?
                <div className="general-error alert-box alert">
                  {
                    this.state.errors.map(error => {
                      return <span key={error}><Trans id={error}/></span>
                    })
                  }
                </div>
                : null
            }
          </div>

          <div className="content">
            {this.props.children}
          </div>

        </div>

        <Footer/>


      </React.Fragment>
    );
  }
}
