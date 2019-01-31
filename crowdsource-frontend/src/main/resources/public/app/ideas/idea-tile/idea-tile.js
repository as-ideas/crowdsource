angular.module('crowdsource')
    .directive('ideaTile', function ($timeout, Idea) {

        var DEFAULT_RATING = {
            ownVote: 0,
            averageRating: 0,
            countVotes: 0
        };

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
                vm.rating = $scope.idea.rating || DEFAULT_RATING;
                vm.campaignId = $scope.campaign.id;
                vm.isVotingDisabled = false;
                vm.rejectionComment = "";

                vm.isAdminView = $scope.admin || false;

                vm.vote = function (value) {
                    if(vm.isVotingDisabled) return;

                    // reset voting by setting value to null, if user clicks on same value
                    if (vm.rating.ownVote === value) {
                        value = 0;
                    }

                    vm.isVotingDisabled = true;
                    Idea.voteIdea(vm.campaignId, vm.idea.id, value)
                        .then(function(rating) {
                            vm.rating = rating;
                        })
                        .finally(function() {
                            $timeout(function() {vm.isVotingDisabled = false; }, 2000);
                        });
                };

                vm.publish = function () {
                    if (!vm.isAdminView) { throw Error('publishing is only allowed for admin');}
                    Idea.publishIdea(vm.campaignId, vm.idea.id)
                };

                vm.reject = function () {
                    if (!vm.isAdminView) { throw Error('rejection is only allowed for admin');}
                    Idea.rejectIdea(vm.campaignId, vm.idea.id, vm.rejectionComment)
                };
            }
        };
    });