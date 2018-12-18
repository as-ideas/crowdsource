import React from 'react'
import { AuthConsumer } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

class Login extends React.Component {
    render() {
        return (
            <AuthConsumer>
                {({ isAuth, login, logout }) => (
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
            </AuthConsumer>
        )
    }
}

export default Login