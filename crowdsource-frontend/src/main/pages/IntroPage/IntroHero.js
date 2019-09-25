import React from "react";


export default class IntroHero extends React.Component {
    render() {
        return (
            <div className='teaser--hero'>
                <img src={require('./teaser-hero-image.jpg')} className="teaser-hero-image"/>
            </div>
        )
    };
};
