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
            controller: function ($scope) {
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
                            var message = 'Vielen Dank für deine Bewertung.';
                            if (value === 0) {
                                message = 'Wir haben deine Bewertung entfernt.';
                            }
                            $rootScope.$broadcast('VOTE_'+vm.idea.id, {type:'success', message: message});
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
                        $rootScope.$broadcast('VOTE_'+vm.idea.id, {type:'success', message: 'Deine Änderung wurde erfolgreich gespeichert.'});
                        vm.isEditable = false;
                    })
                };

                vm.publish = function () {
                    if (!vm.isAdminView) {
                        throw Error('publishing is only allowed for admin');
                    }
                    Idea.publishIdea(vm.campaignId, vm.idea.id)
                        .then(function () {
                            $rootScope.$broadcast('ADMIN_'+vm.idea.id, {type:'success', message: 'Die Idee wurde freigegeben.'});
                            handleSuccessCallback();
                        });
                };

                vm.reject = function () {
                    if (!vm.isAdminView) {
                        throw Error('rejection is only allowed for admin');
                    }
                    Idea.rejectIdea(vm.campaignId, vm.idea.id, vm.rejectionComment)
                        .then(function () {
                            $rootScope.$broadcast('ADMIN_'+vm.idea.id, {type:'failure', message: 'Die Idee wurde abgelehnt.'});
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