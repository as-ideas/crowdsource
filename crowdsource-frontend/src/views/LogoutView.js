import React from 'react'
import { AuthConsumer } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import FormContainer from '../atoms/container/FormContainer'

class LogoutView extends React.Component {
  render () {
    return (
      <div>
        <AuthConsumer>
          {({ logout }) => (
            logout()
          )}
        </AuthConsumer>
        <FormContainer>
          <h1>Du wurdest ausgeloggt</h1>
          <p>Du kannst Dich <Link to='login'>hier</Link> wieder einloggen.</p>
        </FormContainer>
      </div>
    )
  }
}

export default LogoutView
