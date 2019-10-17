import React from 'react'
import {I18n} from "@lingui/react";
import PageMeta from "../../layout/PageMeta";
import {t} from "@lingui/macro";

export default class DebugView extends React.Component {

  createDevData() {
    fetch(`/demo`, {
      method: 'GET',
    }).then(response => {
      console.info("DEMO GET", response.statusText, response.status);
    }).catch(console.error);
  }


  clearData() {
    fetch(`/demo`, {
      method: 'DELETE',
    }).then(response => {
      console.info("DEMO GET", response.statusText, response.status);
    }).catch(console.error);
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta title="Debug" />
        <div className="content ng-scope" data-ng-view="" autoscroll="true">
          <content-row className="ng-scope">
            <div className="container">
              <button onClick={this.createDevData.bind(this)} style={{margin: "4px"}}>Create Test Data</button>
              <button onClick={this.clearData.bind(this)} style={{margin: "4px"}}>Delete all data</button>
            </div>
          </content-row>
        </div>
      </React.Fragment>
    )
  };

};
