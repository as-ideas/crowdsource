angular.module('crowdsource')

    .directive('progressBar', function () {
        return {
            restrict: 'E',
            scope: {
                value: '=',
                maximum: '='
            },
            template: '<div class="cs-progress"><span class="cs-progress__meter" ng-style="{ width: getWidth() }"></span></div>',
            controller: function ($scope) {

                $scope.getWidth = function () {
                    var percentage = $scope.value / $scope.maximum * 100;

                    if (percentage > 100) {
                        percentage = 100;
                    }
                    else if (percentage < 0) {
                        percentage = 0;
                    }

                    return percentage + '%';
                };
            }
        }
    });
