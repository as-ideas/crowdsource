angular.module('crowdsource')
    .directive('ideaAdd', function () {

        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'app/ideas/idea-add/idea-add.html',
            controller: function ($scope, Idea) {
            }
        };
    });