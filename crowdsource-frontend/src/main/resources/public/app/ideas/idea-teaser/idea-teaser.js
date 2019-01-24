angular.module('crowdsource')
    .directive('ideaTeaser', function () {
        return {
            restrict: 'E',
            scope: {
                'campaign': "="
            },
            templateUrl: 'app/ideas/idea-teaser/idea-teaser.html',
            controller: function ($scope) {
            }
        };
    });