angular.module('crowdsource')
    .directive('ideaAdd', function () {

        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'app/components/idea-add/idea-add.html',
            controller: function ($scope, Idea) {
            }
        };
    });