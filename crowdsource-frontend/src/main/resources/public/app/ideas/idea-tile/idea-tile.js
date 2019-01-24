angular.module('crowdsource')
    .directive('ideaTile', function () {

        return {
            restrict: 'E',
            scope: {
                'idea': '='
            },
            templateUrl: 'app/ideas/idea-tile/idea-tile.html',
            controller: function ($scope) {

            }
        };
    });