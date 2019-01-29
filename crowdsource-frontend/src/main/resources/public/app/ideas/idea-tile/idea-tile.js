angular.module('crowdsource')
    .directive('ideaTile', function ($timeout, Idea) {

        return {
            restrict: 'E',
            scope: {
                'idea': '=',
                'admin': '=',
                'campaign': "="
            },
            controllerAs: 'vm',
            templateUrl: 'app/ideas/idea-tile/idea-tile.html',
            controller: function ($scope) {
                var vm = this;
                vm.idea = $scope.idea;
                vm.campaignId = $scope.campaign.id;
                vm.isVotingDisabled = false;

                vm.isAdminView = $scope.admin || false;

                vm.vote = function (value) {
                    if(vm.isVotingDisabled) return;

                    vm.isVotingDisabled = true;
                    $timeout(function() {vm.isVotingDisabled = false; }, 2000);

                    vm.idea.voted = vm.idea.voted === value ? 0 : value;
                };

                vm.publish = function () {
                    if (!vm.isAdminView) { throw Error('publishing is only allowed for admin');}
                    Idea.publishIdea(vm.campaignId, vm.idea.id)
                };

                vm.reject = function () {
                    if (!vm.isAdminView) { throw Error('rejection is only allowed for admin');}
                    Idea.publishIdea(vm.campaignId, vm.idea.id, vm.idea.rejectionComment)
                };
            }
        };
    });