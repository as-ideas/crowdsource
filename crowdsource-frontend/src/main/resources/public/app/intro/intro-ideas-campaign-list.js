angular.module('crowdsource')
    .directive('introIdeasCampaignList', function () {

        return {
            restrict: 'E',
            scope: {
                'entries': '='
            },
            templateUrl: 'app/intro/intro-ideas-campaign-list.html',
            controller: function ($scope) {}
        };
    });