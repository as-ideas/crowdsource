import React from 'react'
import { AuthConsumer } from '../contexts/AuthContext'
import FormContainer from '../atoms/container/FormContainer'
import { Link, Redirect } from 'react-router-dom'
import Form from '../atoms/forms/Form'
import PrimaryButton from '../atoms/buttons/PrimaryButton/PrimaryButton'

class RegisterView extends React.Component {
  constructor () {
    super()
    this.state = {
      email: 'crowdsource@crowd.source.de',
      acceptAGB: false
    }
  }

  toggleAGBBox = () => {
    this.setState({acceptAGB: !this.state.acceptAGB})
  }

  signup = (email, acceptAGB) => {
    alert("email: " + email + ", acceptAGB: " + acceptAGB)
  }

  render () {
    return (
      <div>
        <AuthConsumer>
          {({ isAuth }) => (
            <FormContainer>
              {isAuth ? (
                <div>
                  {/* If used is logged in, redirect to start page */}
                  <Redirect to='/' />
                </div>
              ) : (
                <div>
                  <h1>Registrierung</h1>
                  <Form>
                    <label htmlFor='email'>Email-Adresse</label>
                    <input type='text' id='email' placeholder='max.mustermann' autoComplete='username' value={this.state.email} onChange={event => this.setState({ email: event.target.value })} />
                    <input id='agb' type='checkbox' checked={this.state.acceptAGB} onChange={this.toggleAGBBox} />
                    <label htmlFor='agb'>Ich akzeptiere die <Link to='#'>AGB</Link></label>
                    <PrimaryButton label='Registrieren' onClick={() => this.signup(this.state.email, this.state.acceptAGB)} />
                  </Form>
                  <Link to='login'>oder hier anmelden</Link>
                </div>
              )}
            </FormContainer>
          )}
        </AuthConsumer>
      </div>
    )
  }
}

export default RegisterView
