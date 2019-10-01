import React from "react";
import {Trans} from "@lingui/macro";


export default class ContentHero extends React.Component {


  render() {
    let title = this.props.title;
    let description = this.props.description;

    return (
      <content-hero>
        <div className="content-hero__container">
          <h2 className={description ? 'content-hero__headline' : 'content-hero__headline--solo'}>
            <Trans id={title}/>
          </h2>
          <p className="content-hero__description">
            <Trans id={description}/>
          </p>
        </div>
      </content-hero>
    )
  };
};
