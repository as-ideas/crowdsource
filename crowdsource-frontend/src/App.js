import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './App.css'

// Import Contexts
import { AuthProvider } from './contexts/AuthContext'

// Import Atoms and Components
import Breadcrumb from 'components/global/Breadcrumb'
import Footer from 'components/global/Footer'
import Header from 'components/global/Header'
import Motivation from "components/campaign/Motivation";
import ProtectedRoute from 'atoms/route/ProtectedRoute/ProtectedRoute'

// Import Views
import LoginView from 'views/LoginView'
import LogoutView from 'views/LogoutView'
import PasswortRecoveryView from "views/PasswortRecoveryView"
import ProjectsView from 'views/ProjectsView'
import RegisterView from 'views/RegisterView'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <AuthProvider>
          <Header/>
          <Breadcrumb/>
          <Motivation/>
          <ProtectedRoute path='/projects' component={ProjectsView} />
          <Route path='/login' component={LoginView} />
          <Route path='/logout' component={LogoutView} />
          <Route path='/password-recovery' component={PasswortRecoveryView} />
          <Route path='/signup' component={RegisterView} />
          <Footer />
        </AuthProvider>
      </div>
    )
  }
}

export default App
