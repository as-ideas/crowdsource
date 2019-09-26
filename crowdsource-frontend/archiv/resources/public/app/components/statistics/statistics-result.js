angular.module('crowdsource')
    .directive('statisticsResult', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: 'app/components/statistics/statistics-result.html',
            controller: function ($scope) {
                var vm = $scope;

                vm.showResults = function () {
                    return vm.data.statisticType.name !== vm.data.availablePageOptions.NONE.name;
                };
            }
        };
    });