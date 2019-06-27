angular.module('crowdsource')

    .factory('Route', function ($rootScope, $injector, $location, Authentication) {
        var service = {};

        var pathBeforeRedirectToLogin;

        service.init = function () {
            $rootScope.$on('$routeChangeStart', function (event, next) {
                // if the route was configured with requireLogin: true and the user is not logged in, redirect to login
                if (next.requireLogin && !Authentication.currentUser.loggedIn) {

                    // remember the path where the user would have been redirected to
                  pathBeforeRedirectToLogin = interpolate(next.originalPath, next.pathParams);

                    // cancel the requested route change
                    event.preventDefault();

                    // force redirect to login
                    $location.path('/login');
                }

                else if (next.requireAdmin && !Authentication.isAdmin()) {

                    // remember the path where the user would have been redirected to
                  pathBeforeRedirectToLogin = interpolate(next.originalPath, next.pathParams);

                    // cancel the requested route change
                    event.preventDefault();

                    $location.path('/error/notfound');
                }

              function interpolate(string, params) {
                var result = [];
                angular.forEach((string || '').split(':'), function (segment, i) {
                  if (i === 0) {
                    result.push(segment);
                  } else {
                    var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
                    var key = segmentMatch[1];
                    result.push(params[key]);
                    result.push(segmentMatch[2] || '');
                    delete params[key];
                  }
                });
                return result.join('');
              }

            });
        };

        service.redirectToOriginallyRequestedPageOr = function (fallbackPath) {
            if (pathBeforeRedirectToLogin && pathBeforeRedirectToLogin != '/login') {
                $location.path(pathBeforeRedirectToLogin);
            }
            else {
                $location.path(fallbackPath);
            }

            pathBeforeRedirectToLogin = undefined;
        };

        /**
         * The difference to listening to $routeChangeSuccess is that the callback
         * is directly called for the current route too. This is useful when registering
         * a callback on page load. Sometimes the element is initialized after the route
         * change event fires, leading to a missed event. In case the element is initialized
         * before the event fired, then the callback is not called again.
         */
        service.onRouteChangeSuccessAndInit = function (callback) {
            callback({}, service.getCurrentRoute());

            service.onRouteChangeSuccess(function (event, current, previous) {
                // On page load, a route change is fired with no previous route.
                // As callback is already called first, do not do it twice
                if (previous) {
                    callback.apply($rootScope, arguments);
                }
            });
        };

        // just a proxy for easier mocking
        service.onRouteChangeSuccess = function (callback) {
            $rootScope.$on('$routeChangeSuccess', function () {
                callback.apply($rootScope, arguments);
            });
        };

        // just a proxy for easier mocking. changing the $route.current in a test leads to a route being changed
        service.getCurrentRoute = function () {
            // adding $route as a dependency of the factory leads to curious karma tests issues,
            // get the dependency on demand
            var $route = $injector.get('$route');
            return $route.current;
        };

        return service;
    });
