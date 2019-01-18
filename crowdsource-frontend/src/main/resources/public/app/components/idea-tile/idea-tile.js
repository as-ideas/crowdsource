angular.module('crowdsource')
    .directive('ideaTile', function () {

        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'app/components/idea-tile/idea-tile.html',
            controller: function ($scope, Idea) {
            }
        };
    });