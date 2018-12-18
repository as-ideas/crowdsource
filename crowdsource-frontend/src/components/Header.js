import React from 'react'
import { Link } from 'react-router-dom'
import {AuthConsumer} from "../contexts/AuthContext";


class Header extends React.Component {
    render() {
        return (
            <header>
                <AuthConsumer>
                    {({ isAuth, login, logout }) => (
                        <div>
                            {isAuth ? (
                                    <ul>
                                        <li><Link to="logout">Logout</Link></li>
                                    </ul>
                            ) : (
                                    <ul>
                                        <li><Link to="login">Login</Link></li>
                                        <li><Link to="signup">Registieren</Link></li>
                                    </ul>
                            )}
                        </div>
                    )}
                </AuthConsumer>
            </header>
        )
    }
}

export default Header