import UserService from "./UserService";
import param from "jquery-param";
import Events from "./Events";

const TOKENS_LOCAL_STORAGE_KEY = 'tokens';


class AuthTokenService {
  constructor() {
    this.roles = {};
  }

  setToken(tokens) {
    if (tokens) {
      window.localStorage[TOKENS_LOCAL_STORAGE_KEY] = JSON.stringify(tokens);
    } else {
      console.error("Trying to set empty jwt!")
    }
  }

  getTokens() {
    let tokensAsString = window.localStorage[TOKENS_LOCAL_STORAGE_KEY];
    if (tokensAsString) {
      return JSON.parse(tokensAsString);
    }
    return null;
  }

  clear() {
    window.localStorage.removeItem(TOKENS_LOCAL_STORAGE_KEY);
  }

  getUserFromToken() {
    var tokens = this.getTokens();
    if (!tokens || !tokens.access_token) {
      return null;
    }
    var accessToken = tokens.access_token;
    var items = accessToken.split('.');
    if (items.length !== 3) {
      return null;
    }

    var user = null;
    var decoded = atob(items[1]);
    try {
      user = JSON.parse(decoded);
    } catch (e) {
      user = null;
    }

    return user;
  }
}

class AuthService {
  constructor() {
    this.userService = UserService;
    this.authTokenService = new AuthTokenService();

    // initialize with anonymouse for now. Will be refreshed on init()
    this.currentUser = this.userService.anonymous();
  }

  init() {
    this.reloadUser();
  }

  getToken() {
    return this.authTokenService.getTokens();
  }

  setRolesFromToken() {
    var user = this.authTokenService.getUserFromToken();
    this.currentUser.roles = (user && user.authorities) ? user.authorities : [];
  }

  login(email, password) {

    let requestBody = {
      username: email,
      password: password,
      client_id: 'web',
      grant_type: 'password'
    };

    return new Promise((resolve, reject) => {
      fetch('/oauth/token', {
        method: 'POST',
        body: param(requestBody),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          reject('bad_credentials');
        } else {
          reject('unknown');
        }
      }).then(jsonData => {
        this.authTokenService.setToken(jsonData);
        this.reloadUser();
        resolve(jsonData);
      })
    });
  };

  reloadUser() {
    if (this.authTokenService.getTokens()) {
      // prevents the user's details to be set to undefined while loading
      // and therefore flickering of e.g. the user budget in the status-bar
      this.currentUser.loggedIn = true;
      this.setRolesFromToken();
      this.userService.authenticated()
        .then((user) => {
          this.currentUser = user;
          Events.emitUserStateListener();
        });
    } else {
      this.currentUser = this.userService.anonymous();
    }
    return this.currentUser;
  };

  isAdmin() {
    return this.currentUser && this.currentUser.hasRole('ADMIN');
  };

  logout() {
    this.authTokenService.clear();
    this.currentUser = this.userService.anonymous();
    Events.emitUserStateListener();
  };

}

export default new AuthService();

