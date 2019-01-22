angular.module('crowdsource')
    .directive('introCampaignList', function () {

        return {
            restrict: 'E',
            scope: {
                'entries': '='
            },
            templateUrl: 'app/intro/intro-campaign-list.html',
            controller: function ($scope) {}
        };
    });