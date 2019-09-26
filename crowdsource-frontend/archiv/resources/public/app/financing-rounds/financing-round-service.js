angular.module('crowdsource')

    .factory('FinancingRound', function ($resource, $q) {

        var service = {};
        var currentFinancingRound = {$resolved: false};
        var currentRoundInitialized = false;

        var financingRoundResource = $resource('/financingrounds/:id');

        var stopFinancingRoundRessource = $resource('/financingrounds/:id/cancel', {}, {
            'update': {
                method: 'PUT'
            }
        });

        var financingRoundsResource = $resource('/financingrounds', {}, {
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    var response = angular.fromJson(data);

                    angular.forEach(response, function (round) {
                        round.start = new Date(round.start);
                        round.end = new Date(round.end);
                    });
                    return response;
                }
            }
        });

        service.start = function (financingRound) {
            return financingRoundResource.save(financingRound).$promise;
        };

        service.stop = function (financingRound) {
            return stopFinancingRoundRessource.update({id: financingRound.id}, {}).$promise;
        };

        service.getAll = function () {
            return financingRoundsResource.query();
        };

        service.loadMostRecentRound = function (forceUpdate) {
            forceUpdate = forceUpdate != undefined ? forceUpdate : false;
            var deferredRes = $q.defer();
            if (currentRoundInitialized && !forceUpdate) {
                deferredRes.resolve(currentFinancingRound);
                return deferredRes.promise;
            }
            currentRoundInitialized = true;
            currentFinancingRound = financingRoundResource.get(
                {id: 'mostRecent'},
                {},
                function (resp) {
                    currentFinancingRound = resp;
                    deferredRes.resolve(currentFinancingRound);
                },
                function (response) {
                    //also resolve the deferred when a 404 is returned
                    // (this means that there is no active financing round atm)
                    if (response.status == 404) {
                        currentFinancingRound.active = false;
                        deferredRes.resolve(currentFinancingRound);
                    }
                    else {
                        deferredRes.reject(response);
                    }
                }
            );
            return deferredRes.promise;
        };

        service.currentFinancingRound = function () {
            service.loadMostRecentRound(false);
            return currentFinancingRound;
        };

        service.reloadCurrentRound = function () {
            var promise = service.loadMostRecentRound(true);
            return promise;
        };

        return service;
    });