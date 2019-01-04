import React, { Component } from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginView from './views/LoginView'
import ProjectsView from './views/ProjectsView'
import RegisterView from './views/RegisterView'
import LogoutView from './views/LogoutView'
import Header from "./components/Header";

class App extends Component {
  render () {
    return (
      <div className='App'>
        <AuthProvider>
          <Header/>
          <ProtectedRoute path='/projects' component={ProjectsView} />
          <Route path='/login' component={LoginView} />
          <Route path='/logout' component={LogoutView} />
          <Route path='/signup' component={RegisterView} />
        </AuthProvider>
      </div>
    )
  }
}

export default App
