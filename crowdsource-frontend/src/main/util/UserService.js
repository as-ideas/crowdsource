class UserService {

  register(user) {
    return new Promise(function(resolve,reject) {
      fetch(`/user/:id`,{
        method: 'POST',
        body: JSON.stringify(user)
      })
      .then(response => function(response) {
        var data = JSON.parse(response.data);
        data.loggedIn = true;
        resolve(this.augmentUser(data));
      })
      .catch(error)
      {
        reject(error);
      }
    })
  }

  activate(user) {
    return fetch(`/user/${user.email}/activation`,{
      method: 'POST',
      body: JSON.stringify(user)
    });
  }

  recoverPassword(email) {
    return fetch(`/user/${email}/password-recovery`,{
      method: 'GET'
    });
  }

  /**
   * Returns the current user object
   *
   * @returns Promise<User> with loggedIn
   */
  authenticated() {
    /*return new Promise(function(resolve,reject) {
      fetch(`/user/current`,{
        method: 'GET',
      })
      .then(response => function(response) {
          var data = JSON.parse(response.data);
          data.loggedIn = true;
          resolve(this.augmentUser(data));
        })
      .catch(error)
      {
        reject(error);
      }
    })
    */

    // TODO: Make backend call but return fake user in the meantime
    // Who will handle the backend response then? Formerly done by angular resouce...

    var user = UserResource.current();
    // already set the user as logged in, even if the server did not respond yet
    // we expect this call to be only called if there is an auth token available in the app
    user.loggedIn = true;
    return this.augmentUser(user);
  }

  anonymous() {
    return {
      loggedIn: false,
      budget: 0
    }
    /*
    var userData = {
      loggedIn: false,
      // $resolved: true, TODO: Action required?
      budget: 0
    };
    // TODO: What to return here instaed of UserResource?
    return new UserResource(this.augmentUser(userData));
    */
  }

  getMetrics() {
    return fetch('/users/metrics',{
      method: 'GET'
    });
  }

  augmentUser(user) {
    user.hasRole = function (role) {
      if (!this.roles) {
        return false;
      }
      return this.roles.indexOf('ROLE_' + role) >= 0;
    };
    return user;
  }
}

export default new UserService();

