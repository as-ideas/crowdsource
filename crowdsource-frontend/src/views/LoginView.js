import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import {Link, Redirect} from "react-router-dom";
import FormBox from "../atoms/container/FormBox";
import Form from "../atoms/forms/Form";
import PrimaryButton from "../atoms/buttons/PrimaryButton"

class LoginView extends React.Component {

    state = {
        email: "crowdsource@crowd.source.de",
        password: "einEselGehtZumBaecker!"
    }

    render() {
        // Referrer is passed in by ProtectedRoute component
        let referrer = { pathname: '/projects' }
        if(this.props.location.state) referrer = this.props.location.state.referrer
        return (
            <div>
                <Header />
                <AuthConsumer>
                    {({ isAuth, login }) => (
                        <FormBox>
                        {isAuth ? (
                                <div>
                                    <Redirect to={referrer} />
                                </div>
                            ) : (
                                <div>
                                    <h1>Login</h1>
                                    <Link to="password-recovery">Passwort vergessen</Link>
                                    <Form>
                                        <label htmlFor="email">Email-Adresse</label>
                                        <input id="email" placeholder="max.mustermann" autoComplete="username" value="crowdsource@crowd.source.de" onChange={event => this.setState({ email: event.target.value })} />
                                        <label htmlFor="password">Passwort</label>
                                        <input id="password" type="password" autoComplete="current-password" value="einEselGehtZumBaecker!" onChange={ event => this.setState({password: event.target.value}) }/>
                                        <PrimaryButton label="Login" onClick={ () => login(this.state.email,this.state.password)}/>
                                    </Form>
                                    <Link to="signup">oder hier registrieren</Link>
                                </div>
                            )}

                        </FormBox>
                    )}
                </AuthConsumer>
            </div>
        )
    }
}

export default LoginView