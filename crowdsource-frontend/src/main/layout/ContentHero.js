import React from "react";
import {Trans} from "@lingui/macro";


export default class ContentHero extends React.Component {
  render() {
    let description = this.props.description;
    let title = this.props.title;

    return (
      <content-hero>
        <div className="content-hero__container">
          <h2 className={description ? 'content-hero__headline' : 'content-hero__headline--solo'}>
            <Trans id={title}/>
          </h2>
          <p className="content-hero__description"/>
          {this.props.children}
        </div>
      </content-hero>
    )
  };
};
