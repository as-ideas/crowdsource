angular.module('crowdsource')
    .directive('contentHero', function () {
        return {
            restrict: 'E',
            scope: {
                'title': '@',
                'description': '@',
            },
            controllerAs: 'vm',
            templateUrl: 'app/components/misc/content-hero/content-hero.html',
            controller: function ($scope) {
                var vm = this;
                vm.title = $scope.title;
                vm.description = $scope.description;
            }
        };
    });