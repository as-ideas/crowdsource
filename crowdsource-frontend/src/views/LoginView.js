import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import {Link, Redirect} from "react-router-dom";

class LoginView extends React.Component {
    render() {
        // Referrer is passed in by ProtectedRoute component
        let referrer = { pathname: '/' }
        if(this.props.location.state) referrer = this.props.location.state.referrer
        return (
            <div>
                <Header />
                <AuthConsumer>
                    {({ isAuth, login }) => (
                        <div>
                            {isAuth ? (
                                <div>
                                    <Redirect to={referrer} />
                                </div>
                            ) : (
                                <div>
                                    <Link to="password-recovery">Passwort vergessen</Link>
                                    <form>
                                        <label htmlFor="email">Email-Adresse</label>
                                        <input id="email" placeholder="max.mustermann"/>
                                        <label htmlFor="password">Passwort</label>
                                        <input id="password" type="password"/>
                                        <input type="Button" value="Login" onClick={login}/>
                                        <Link to="signup">oder hier registrieren</Link>
                                    </form>
                                </div>
                            )}

                        </div>
                    )}
                </AuthConsumer>
            </div>
        )
    }
}

export default LoginView