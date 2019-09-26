angular.module('crowdsource')

    .factory('ServerTime', function ($resource) {

        var service = {};

        var dateTimeResource = $resource('/datetime');
        var serverClientTimeOffset;

        service.reloadReferenceTime = function () {
            var serverTime = dateTimeResource.get();

            serverTime.$promise
                .then(function (response) {
                    var clientTime = new Date().getTime();
                    var serverTime = new Date(response.dateTime).getTime();

                    serverClientTimeOffset = serverTime - clientTime;
                });

            return serverTime;
        };

        service.getInterpolatedTimeOfServer = function () {
            var now = new Date();

            if (!serverClientTimeOffset) {
                // return the local time if reloadReferenceTime was not called yet or did not complete
                return now;
            }

            return new Date(now.getTime() + serverClientTimeOffset);
        };

        return service;
    });