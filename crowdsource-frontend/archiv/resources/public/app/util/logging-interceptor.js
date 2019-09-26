angular.module('crowdsource')

    .factory('LoggingInterceptor', function ($q, $log) {

        var service = {};

        service.responseError = function (response) {
            // When selenium captures the browser log, objects are printed out as [Object object], thats why
            // we include the response as json string too
            $log.debug('Server error response as json:', angular.toJson(response), "; as object:", response);

            return $q.reject(response);
        };

        return service;
    });