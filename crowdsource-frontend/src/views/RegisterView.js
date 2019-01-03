import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import FormBox from "../atoms/container/FormBox";
import {Link, Redirect} from "react-router-dom";
import Form from "../atoms/forms/Form";
import PrimaryButton from "../atoms/buttons/PrimaryButton";

class RegisterView extends React.Component {

    state = {
        email: "",
        acceptAGB: false
    }

    render() {
        return (
            <div>
                <Header />
                <AuthConsumer>
                    {({ isAuth }) => (
                        <FormBox>
                            {isAuth ? (
                                <div>
                                    {/* If used is logged in, redirect to start page */}
                                    <Redirect to="/"/>
                                </div>
                            ) : (
                                <div>
                                    <h1>Registrierung</h1>
                                    <Form>
                                        <label htmlFor="email">Email-Adresse</label>
                                        <input type="text" id="email" placeholder="max.mustermann" autoComplete="username" value="crowdsource@crowd.source.de" onChange={event => this.setState({ email: event.target.value })} />
                                        <input id="agb" type="checkbox" onChange={ event => this.setState({acceptAGB: event.target.value}) }/>
                                        <label htmlFor="agb">Ich akzeptiere die <Link to="#">AGB</Link></label>
                                        <PrimaryButton label="Registrieren" onClick={ () => alert('Not implemented yet')}/>
                                    </Form>
                                    <Link to="login">oder hier anmelden</Link>
                                </div>
                            )}

                        </FormBox>
                    )}
                </AuthConsumer>
            </div>
        )
    }
}

export default RegisterView