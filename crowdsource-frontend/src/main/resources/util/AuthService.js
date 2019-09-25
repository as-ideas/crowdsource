const TOKENS_LOCAL_STORAGE_KEY = 'tokens';


class AuthTokenService {
  constructor() {
    this.roles = {};
    this.headers = Headers.Headers();
  }

  getTokens() {
    var tokens = null;
    var storage = Window.localStorage;

    if (!storage) {
      throw "only browsers with local storage are supported";
    }

    var tokensAsString = storage[TOKENS_LOCAL_STORAGE_KEY];
    if (tokensAsString) {
      try {
        tokens = JSON.parse(tokensAsString);
      } catch(e) {
        tokens = null;
      }
    }
    return tokens;
  }

  load() {
    var tokens = this.getTokens();
    if (tokens) {
      this.setAsHeader(tokens);
    } else {
      this.clear();
    }
  }

  setAsHeader(tokens) {
    var authHeader = `${tokens.token_type} ${tokens.access_token}`;
    this.headers.set('Authorization', authHeader);
    Window.localStorage[TOKENS_LOCAL_STORAGE_KEY] = JSON.stringify(tokens);
  }

  clear() {
    this.headers.remove('Authorization');
    Window.localStorage.removeItem(TOKENS_LOCAL_STORAGE_KEY);
  }

  getUserFromToken() {
    var tokens = this.getTokens();
    if (!tokens || !tokens.access_token) {
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
    } catch(e) {
      user = null;
    }

    return user;
  }

  hasTokenSet() {
    return this.headers.has('Authorization');
  }


}

class AuthService {
  constructor(userService) {
    this.userService = userService;
    this.authTokenService = new AuthTokenService();

    // initialize with anonymouse for now. Will be refreshed on init()
    this.currentUser = this.userService.anonymous();
  }

  init() {
    this.authTokenService.load();
    this.reloadUser();
  }

  setRolesFromToken() {
    var user = this.authTokenService.getUserFromToken();
    this.currentUser.roles = (user && user.authorities) ? user.authorities : [];
  }

  login(email, password) {

    var requestBody = new FormData();
    requesetBody.append('username', email);
    requesetBody.append('password', password);
    requesetBody.append('client_id', 'web');
    requesetBody.append('grant_type', 'password');

    return new Promise(function (resolve, reject) {

      fetch('/oauth/token',{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then((response) => function(response) {
        if(response.status === 200) {
          this.authTokenService.setAsHeader(response.data);
          resolve();
        } else if (response.status === 400 && response.data && response.data.error && response.data.error == 'invalid_grant') {
          reject('bad_credentials');
        } else {
          reject('unknown');
        }
      })
      .finally(function () {
        this.reloadUser();
      });
    });
  };

  reloadUser() {
    // this.currentUser.$resolved = false;

    if (this.authTokenService.hasTokenSet()) {
      this.currentUser.loggedIn = true;
      this.setRolesFromToken();

      // prevents the user's details to be set to undefined while loading
      // and therefore flickering of e.g. the user budget in the status-bar
      this.userService.authenticated().then(user => function (user) {
        this.currentUser = Object.assign({}, user);
      });
    }
    else {
      this.currentUser = this.userService.anonymous();
    }
    return this.currentUser;
  };

  isAdmin() {
    return this.currentUser && this.currentUser.hasRole('ADMIN');
  };

  logout() {
    this.authTokenService.clear();
    this.reloadUser();
  };

}

export default new AuthService();

