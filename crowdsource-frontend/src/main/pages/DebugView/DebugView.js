import React from 'react'

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
      <div className="content ng-scope" data-ng-view="" autoscroll="true">
        <content-row className="ng-scope">
          <div className="container">
            <button onClick={this.createDevData.bind(this)}>Create test data</button>
            <button onClick={this.createDevData.bind(this)}>Delete all data</button>
          </div>
        </content-row>
      </div>
    )
  };

};
