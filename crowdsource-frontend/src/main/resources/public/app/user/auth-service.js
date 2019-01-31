angular.module('crowdsource')

    .factory('AuthenticationToken', function ($http, $window) {

        var TOKENS_LOCAL_STORAGE_KEY = 'tokens';

        var service = {};
        service.TOKENS_LOCAL_STORAGE_KEY = TOKENS_LOCAL_STORAGE_KEY;
        var roles = {};


        service.getTokens = function () {
            var tokens = null;
            var storage = $window['localStorage'];

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
        };

        service.load = function () {
            var tokens = service.getTokens();
            if (tokens) {
                service.setAsHeader(tokens);
            } else {
                service.clear();
            }
        };


        /**
         * @param tokens will be registered as http headers for requests and stored in browser storage
         */
        service.setAsHeader = function (tokens) {
            $http.defaults.headers.common['Authorization'] = tokens.token_type + ' ' + tokens.access_token;
            $window.localStorage[TOKENS_LOCAL_STORAGE_KEY] = JSON.stringify(tokens);
        };

        service.clear = function () {
            $http.defaults.headers.common['Authorization'] = undefined;
            $window.localStorage.removeItem(TOKENS_LOCAL_STORAGE_KEY);
        };

        service.getUserFromToken = function () {
            var tokens = service.getTokens();
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
        };

        /**
         * Checks if a token was set into the default http headers
         */
        service.hasTokenSet = function () {
            return $http.defaults.headers.common['Authorization'] != undefined;
        };

        return service;
    })

    .factory('Authentication', function ($resource, $q, $rootScope, AuthenticationToken, User) {

        var service = {};

        // token resource requires a http form post
        var tokenResource = $resource('/oauth/token', {}, {
            requestTokens: {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        });

        // initialize with anonymouse for now. Will be refreshed on init()
        service.currentUser = User.anonymous();

        service.init = function () {
            AuthenticationToken.load();
            service.reloadUser();
        };

        service.setRolesFromToken = function () {
            var user = AuthenticationToken.getUserFromToken();
            service.currentUser.roles = (user && user.authorities) ? user.authorities : [];
        };

        service.login = function (email, password) {
            // $.param creates a form encoded string, e.g. "username=xyz&password=secret&..."
            var requestBody = $.param({
                username: email,
                password: password,
                client_id: 'web',
                grant_type: 'password'
            });

            return $q(function (resolve, reject) {
                tokenResource.requestTokens(requestBody).$promise
                    .then(function (response) {
                        AuthenticationToken.setAsHeader(response);
                        resolve();
                    })
                    .catch(function (response) {
                        if (response.status == 400 && response.data && response.data.error && response.data.error == 'invalid_grant') {
                            reject('bad_credentials');
                        }
                        else {
                            reject('unknown');
                        }
                    })
                    .finally(function () {
                        service.reloadUser();
                    });
            });
        };

        service.reloadUser = function () {
            service.currentUser.$resolved = false;

            if (AuthenticationToken.hasTokenSet()) {
                service.currentUser.loggedIn = true;
                service.setRolesFromToken();

                // prevents the user's details to be set to undefined while loading
                // and therefore flickering of e.g. the user budget in the status-bar
                User.authenticated().$promise.then(function (user) {
                    angular.copy(user, service.currentUser);
                });
            }
            else {
                service.currentUser = User.anonymous();
            }
            return service.currentUser;
        };

        service.isAdmin = function () {
            return service.currentUser && service.currentUser.hasRole('ADMIN');
        };

        service.logout = function () {
            AuthenticationToken.clear();
            service.reloadUser();
        };

        return service;
    })

    .factory('UnauthorizedInterceptor', function ($q, $location, $injector) {

        var service = {};

        service.responseError = function (response) {
            if (response.status === 401) {
                // the dependency must be requested on demand, else we have circular dependency issues
                // $http <- AuthenticationToken <- UnauthorizedInterceptor <- $http <- $resource <- Authentication
                var AuthenticationToken = $injector.get('AuthenticationToken');

                // remove the invalid token from browser storage and http requests
                AuthenticationToken.clear();

                // redirect to login
                $location.path('/login');
            }

            if (response.status === 403) {
                $location.path('/login');
            }

            return $q.reject(response);
        };

        return service;
    });
