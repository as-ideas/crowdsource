angular.module('crowdsource')

    .factory('User', function ($resource) {

        var service = {};

        var UserResource = $resource('/user/:id', {}, {
            current: {
                method: 'GET',
                params: {id: 'current'},
                transformResponse: function (responseString) {
                    var data = angular.fromJson(responseString);
                    data.loggedIn = true;
                    return augmentUser(data);
                }
            }
        });

        var UserActivationResource = $resource('/user/:email/activation', {email: '@email'});
        var PasswordRecoveryResource = $resource('/user/:email/password-recovery');

        var UserMetricsResource = $resource('/users/metrics');

        service.register = function (user) {
            return UserResource.save(user).$promise;
        };

        service.activate = function (user) {
            return UserActivationResource.save(user);
        };

        service.recoverPassword = function (emailAddress) {
            return PasswordRecoveryResource.get({email: emailAddress});
        };

        service.authenticated = function () {
            var user = UserResource.current();
            // already set the user as logged in, even if the server did not respond yet
            // we expect this call to be only called if there is an auth token available in the app
            user.loggedIn = true;
            return augmentUser(user);
        };

        service.anonymous = function () {
            var userData = {
                loggedIn: false,
                $resolved: true,
                budget: 0
            };
            return new UserResource(augmentUser(userData));
        };

        service.getMetrics = function () {
            return UserMetricsResource.get();
        };

        function augmentUser(user) {
            user.hasRole = function (role) {
                if (!this.roles) {
                    return false;
                }
                return this.roles.indexOf('ROLE_' + role) >= 0;
            };
            return user;
        }

        return service;
    });