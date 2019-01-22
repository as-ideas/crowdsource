angular.module('crowdsource')
    .directive('introPrototypesCampaignList', function () {

        return {
            restrict: 'E',
            scope: {
                'entries': '='
            },
            templateUrl: 'app/intro/intro-prototypes-campaign-list.html',
            controller: function ($scope) {}
        };
    });