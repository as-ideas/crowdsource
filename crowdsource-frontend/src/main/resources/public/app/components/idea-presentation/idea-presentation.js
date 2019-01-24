angular.module('crowdsource')
    .directive('ideaPresentation', function () {
        return {
            restrict: 'E',
            scope: {
                'campaign': "="
            },
            templateUrl: 'app/components/idea-presentation/idea-presentation.html',
            controller: function ($scope) {
            }
        };
    });