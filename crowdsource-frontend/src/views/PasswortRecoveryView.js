import React from 'react'
import FormContainer from '../atoms/container/FormContainer'
import { Link } from 'react-router-dom'
import Form from '../atoms/forms/Form'
import PrimaryButton from '../atoms/buttons/PrimaryButton/PrimaryButton'

class PasswortRecoveryView extends React.Component {
  constructor () {
    super()
    this.state = {
      email: ''
    }
  }

  render () {
    return (
      <div>
        <FormContainer>
            <div>
              <h1>Passwort vergessen</h1>
              <p>Gib hier deine Email-Adresse ein, mit der du dich registriert hast. Du erhältst von uns dann eine E-Mail mit einem Bestätigungslink und kannst dann dein Passwort neu setzen.</p>
              <Form>
                <label htmlFor='email'>Email-Adresse</label>
                <input type='text' id='email' placeholder='max.mustermann' autoComplete='username' value='crowdsource@crowd.source.de' onChange={event => this.setState({ email: event.target.value })} />
                <PrimaryButton label='Abschicken' onClick={() => window.alert('Not implemented yet')} />
              </Form>
              <Link to='login'>oder hier anmelden</Link>
            </div>
        </FormContainer>
      </div>
    )
  }
}

export default PasswortRecoveryView
