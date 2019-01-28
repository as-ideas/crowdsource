angular.module('crowdsource')
    .factory("IdeasCampaignResolver", function (Idea, $route, $location, $q) {

        function resolve () {
            var id = $route.current.params.ideasId;
            var campaignPromise = Idea.getCampaign(id);
            var deferred = $q.defer();

            campaignPromise.then(function (campaign) {
                deferred.resolve(campaign);
            }, function () {
                $location.url('/error/notfound');
            });

            return deferred.promise;
        };

        return {
            resolve: resolve
        }
    });