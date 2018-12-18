import React from 'react'
import Header from '../components/Header.js'
import Login from "../components/Login";

class LoginView extends React.Component {
    render() {
        return (
            <div>
                <Header />
               <Login/>
            </div>
        )
    }
}

export default LoginView