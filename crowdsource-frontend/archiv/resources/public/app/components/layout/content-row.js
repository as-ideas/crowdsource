angular.module('crowdsource')

    .directive('contentRow', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="container" ng-transclude></div>'
        }
    });
