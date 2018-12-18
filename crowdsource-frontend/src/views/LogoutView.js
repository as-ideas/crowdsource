import React from 'react'
import Header from '../components/Header.js'
import Logout from "../components/Logout";

class LogoutView extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Logout/>
            </div>
        )
    }
}

export default LogoutView