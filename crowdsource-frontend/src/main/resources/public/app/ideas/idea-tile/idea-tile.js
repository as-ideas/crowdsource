angular.module('crowdsource')
    .directive('ideaTile', function ($timeout) {

        return {
            restrict: 'E',
            scope: {
                'idea': '=',
                'admin': '='
            },
            controllerAs: 'vm',
            templateUrl: 'app/ideas/idea-tile/idea-tile.html',
            controller: function ($scope) {
                var vm = this;
                vm.idea = $scope.idea;
                vm.isVotingDisabled = false;

                vm.isAdminView = $scope.admin || false;

                vm.vote = function (value) {
                    if(vm.isVotingDisabled) return;

                    vm.isVotingDisabled = true;
                    $timeout(function() {vm.isVotingDisabled = false; }, 2000);

                    vm.idea.voted = vm.idea.voted === value ? 0 : value;
                }
            }
        };
    });