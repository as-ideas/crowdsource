import React from "react";
import {Trans} from "@lingui/macro";


export default class LoadMore extends React.Component {
  render() {
    return (<load-more>
      <div className="loadMore__container">
        {
          this.props.paging.last ?
            <button className="button-secondary loadMore__button">
              <Trans id={this.props.noMoreLabel}/>>
            </button>
            : <button onClick={this.props.loadMore} className="button-secondary loadMore__button">
              <Trans id={this.props.loadMoreLabel}/>>
            </button>
        }
      </div>
    </load-more>)
  };
};
