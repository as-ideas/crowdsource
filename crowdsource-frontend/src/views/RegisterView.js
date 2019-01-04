import React from 'react'
import Header from '../components/Header.js'
import {AuthConsumer} from "../contexts/AuthContext";
import FormBox from "../atoms/container/FormBox";
import {Link, Redirect} from "react-router-dom";
import AlertBox from "../atoms/forms/AlertBox";
import Form from "../atoms/forms/Form";
import PrimaryButton from "../atoms/buttons/PrimaryButton";

class RegisterView extends React.Component {

  state = {
    email: "",
    acceptAGB: false
  }

  toggleAGBBox = () => {
    this.setState({acceptAGB: !this.state.acceptAGB})
  }

  signup = (email, acceptAGB) => {
    alert("email: " + email + ", acceptAGB: " + acceptAGB)
  }

  render() {
    return (
        <div>
          <Header/>
          <AuthConsumer>
            {({isAuth}) => (
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
                          <input type="text" id="email" placeholder="max.mustermann" autoComplete="username"
                                 value="crowdsource@crowd.source.de"
                                 onChange={event => this.setState({email: event.target.value})}/>
                          <input id="agb" type="checkbox" checked={!!this.state.acceptAGB}
                                 onChange={this.toggleAGBBox}/>
                          <label htmlFor="agb">Ich akzeptiere die <Link to="#">AGB</Link></label>
                          <PrimaryButton label="Registrieren"
                                         onClick={() => this.signup(this.state.email, this.state.acceptAGB)}/>
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