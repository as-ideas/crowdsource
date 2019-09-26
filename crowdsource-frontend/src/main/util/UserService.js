class UserService {

    register(user) {
        return new Promise((resolve, reject) => {
            fetch(`/user/:id`, {
                method: 'POST',
                body: JSON.stringify(user)
            })
                .then((response) => {
                    return response.json();
                })
                .then(jsonData => {
                    jsonData.loggedIn = true;
                    resolve(this.augmentUser(jsonData));
                })
                .catch(error => {
                    reject(error);
                });
        })
    }

    activate(user) {
        return fetch(`/user/${user.email}/activation`, {
            method: 'POST',
            body: JSON.stringify(user)
        });
    }

    recoverPassword(email) {
        return fetch(`/user/${email}/password-recovery`, {
            method: 'GET'
        });
    }

    /**
     * Returns the current user object
     *
     * @returns Promise<User> with loggedIn
     */
    authenticated() {
        return new Promise((resolve, reject) => {
            fetch(`/user/current`, {
                method: 'GET',
            }).then(response => {
                return response.json();
            }).then(jsonData => {
                jsonData.loggedIn = true;
                resolve(this.augmentUser(jsonData));
            }).catch(error => {
                reject(error);
            })
        });
    }

    anonymous() {
        return this.augmentUser({
            loggedIn: false,
            budget: 0
        });
    }

    getMetrics() {
        return fetch('/users/metrics', {
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

