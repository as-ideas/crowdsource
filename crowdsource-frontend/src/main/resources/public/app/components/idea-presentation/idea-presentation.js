angular.module('crowdsource')
    .directive('ideaPresentation', function () {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'app/components/idea-presentation/idea-presentation.html',
            controller: function ($scope, Project) {
            }
        };
    });