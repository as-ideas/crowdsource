import React from 'react'
import AuthService from "../util/AuthService";
import ValidationService from "../util/ValidationService";
import RoutingService from "../util/RoutingService";

const AuthContext = React.createContext();

class AuthContextProvider extends React.Component {
  constructor() {
    super();

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.validate = this.validate.bind(this)
    this.isValid = this.isValid.bind(this)

    this.state = {
      errors: {},
      isLoading: false,
      isLoggedIn: false,
      isAdmin: false
    }
  }

  login(email, password) {
    this.validate(email, password);

    if(!this.isValid()) {
      this.setState(this.state);
      return;
    }

    this.setState({isLoading: true});

    AuthService.login(email, password)
      .then((response) => {
        console.log("response")
        if (response.errorCode) {
          console.log("login error")
          this.setState({errors: ValidationService.errorObjectFromBackend(response)});
        } else {
          console.log("login")
          this.setState({isLoggedIn: true})
          RoutingService.redirectToOriginallyRequestedPageOr('/');
        }
      })
      .catch(console.error)
      .finally(() => {
        this.setState({isLoading: false});
      });
  }

  logout() {
    AuthService.logout();
    console.log("Logout")
    this.setState({
      isLoggedIn: false,
      isAdmin: false
    })
  }

  validate(email, password) {
    this.state.errors = {};

    if (!email) this.state.errors.email = ['FORM_EMAIL_ERROR_REQUIRED'];
    else if (!ValidationService.isEmailValid(email)) this.state.errors.email = ['FORM_EMAIL_ERROR_INVALID'];

    if (!password) this.state.errors.password = ['FORM_PASSWORD_ERROR_REQUIRED'];
  }

  isValid() {
    return Object.keys(this.state.errors).length === 0;
  }


  render () {
    return (
      <AuthContext.Provider value={{
        errors: this.state.errors,
        isLoading: this.state.isLoading,
        isLoggedIn: this.state.isLoggedIn,
        isAdmin: this.state.isAdmin,
        login: this.login,
        logout: this.logout
      }}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }

}

const AuthContextConsumer = AuthContext.Consumer;

export { AuthContextProvider, AuthContextConsumer }
