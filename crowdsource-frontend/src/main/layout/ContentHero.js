import React from "react";
import TranslationService from "../util/TranslationService";


export default class ContentHero extends React.Component {
    render() {
        return (
            <div className="content-hero__container">
                <h2 className={this.props.description ? 'content-hero__headline' : 'content-hero__headline--solo'}>{TranslationService.translate(this.props.title)}</h2>
                <p className=" content-hero__description">
                    {TranslationService.translate(this.props.description)}
                </p>
                {this.props.children}
            </div>

        )
    };
};
