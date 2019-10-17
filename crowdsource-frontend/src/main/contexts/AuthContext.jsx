import React from 'react'
import AuthService from "../util/AuthService";
import ValidationService from "../util/ValidationService";
import RoutingService from "../util/RoutingService";
import Events from "../util/Events";

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
      isLoggedIn: AuthService.isLoggedIn(),
      isAdmin: AuthService.isAdmin()
    }

    if (AuthService.isLoggedIn()) {
      AuthService.validateCurrentUser()
        .then((response) => {
          this.setState({
            isLoggedIn: AuthService.isLoggedIn(),
            isAdmin: AuthService.isAdmin()
          })
        });
    }
  }

  login(email, password) {
    this.validate(email, password);

    if (!this.isValid()) {
      this.setState(this.state);
      return;
    }

    this.setState({isLoading: true});

    AuthService.login(email, password)
      .then((response) => {
        if (response.errorCode) {
          this.setState({errors: ValidationService.errorObjectFromBackend(response)});
        } else {
          this.setState({
            isLoggedIn: true,
            isAdmin: AuthService.isAdmin()
          });
          RoutingService.redirectToOriginallyRequestedPageOr('/');
        }
      })
      .catch(error => {
        console.log("Login did not work", error);
        this.setState({errors: {general: [error]}})
      })
      .finally(() => {
        this.setState({isLoading: false});
      });
  }

  logout() {
    AuthService.logout();
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


  render() {
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

export {AuthContextProvider, AuthContextConsumer}
