import React from "react";
import {Link, NavLink} from 'react-router-dom'
import Header from "./Header";
import Footer from "./Footer";

export default class Layout extends React.Component {
    render() {
        return (
            <div className="page-wrapper">
                <Header/>

                <div className="content">
                    <div className="container">
                        {this.props.children}
                    </div>
                </div>

                <Footer/>
            </div>
        );
    }
}
