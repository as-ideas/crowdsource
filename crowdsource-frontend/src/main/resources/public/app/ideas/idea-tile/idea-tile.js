angular.module('crowdsource')
    .directive('ideaTile', function ($timeout, Idea, $rootScope, OVERLAY_ANIMATION_DURATION) {

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
                'campaign': "=",
                'successFn': "="
            },
            controllerAs: 'vm',
            templateUrl: 'app/ideas/idea-tile/idea-tile.html',
            controller: function ($scope, $filter) {
                var $translate = $filter('translate');

                var vm = this;
                vm.idea = $scope.idea;
                vm.rating = $scope.idea.rating || DEFAULT_RATING;
                vm.rating.averageRating = Math.round(vm.rating.averageRating * 10) / 10;
                vm.campaignId = $scope.campaign.id;
                vm.isVotingDisabled = !$scope.campaign.active || false;
                vm.rejectionComment = "";
                vm.isEditable = false;

                vm.isAdminView = $scope.admin || false;

                vm.vote = function (value) {
                    if (vm.isVotingDisabled) return;

                    // reset voting by setting value to null, if user clicks on same value
                    if (vm.rating.ownVote === value) {
                        value = 0;
                    }

                    vm.isVotingDisabled = true;
                    Idea.voteIdea(vm.campaignId, vm.idea.id, value)
                        .then(function (rating) {
                            if (value === 0) {
                                $rootScope.$broadcast('VOTE_'+vm.idea.id, { type:'success', message: $translate('IDEA_REMOVE_VOTE_MESSAGE')});
                            } else {
                                $rootScope.$broadcast('VOTE_'+vm.idea.id, { type:'success', message: $translate('IDEA_VOTE_MESSAGE')});
                            }
                            vm.rating = rating;
                        })
                        .finally(function () {
                            $timeout(function () {
                                vm.isVotingDisabled = false;
                            }, 2000);
                        });
                };

                vm.cancelEdit = function () {
                    vm.isEditable = false;
                };

                vm.update = function () {
                    Idea.updateIdea(vm.campaignId, vm.idea).then(function (res) {

                        $rootScope.$broadcast('VOTE_'+vm.idea.id, { type:'success', message: $translate('IDEA_UPDATE_MESSAGE') });
                        vm.isEditable = false;
                    })
                };

                vm.publish = function () {
                    if (!vm.isAdminView) {
                        throw Error('publishing is only allowed for admin');
                    }
                    Idea.publishIdea(vm.campaignId, vm.idea.id)
                        .then(function () {
                            $rootScope.$broadcast('ADMIN_'+vm.idea.id, { type:'success', message: $translate('ADMIN_IDEA_PUBLISH_MESSAGE') });
                            handleSuccessCallback();
                        });
                };

                vm.reject = function () {
                    if (!vm.isAdminView) {
                        throw Error('rejection is only allowed for admin');
                    }
                    Idea.rejectIdea(vm.campaignId, vm.idea.id, vm.rejectionComment)
                        .then(function () {
                            $rootScope.$broadcast('ADMIN_'+vm.idea.id, { type:'failure', message: $translate('ADMIN_IDEA_REJECT_MESSAGE') });
                            handleSuccessCallback();
                        });
                };

                vm.edit = function () {
                    vm.isEditable = true;
                };

                function handleSuccessCallback() {
                    if (typeof $scope.successFn === 'function') {
                        $timeout(function() {
                            $scope.successFn();
                        }, OVERLAY_ANIMATION_DURATION)

                    }
                }
            }
        };
    });