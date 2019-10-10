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
            <button onClick={this.createDevData.bind(this)} value="CREATE"/>
            <button onClick={this.createDevData.bind(this)} value="DELETE"/>
          </div>
        </content-row>
      </div>
    )
  };

};
