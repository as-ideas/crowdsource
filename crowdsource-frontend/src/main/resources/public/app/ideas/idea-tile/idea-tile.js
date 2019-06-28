angular.module('crowdsource')
    .directive('ideaTile', function ($timeout, Idea, $rootScope, $filter, $translate, OVERLAY_ANIMATION_DURATION) {

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
              'own': '=',
                'campaign': "=",
                'successFn': "="
            },
            controllerAs: 'vm',
            templateUrl: 'app/ideas/idea-tile/idea-tile.html',
            controller: function ($scope, $rootScope, $filter, $translate) {

                $rootScope.$on('$translateChangeSuccess', function (event,data) {
                    vm.currentLanguage = data.language;
                    resetTranslation();
                });

                var vm = this;
                vm.currentLanguage = $translate.use();
                resetTranslation();

                vm.selectTranslation = selectTranslation;

                vm.idea = $scope.idea;
                vm.rating = $scope.idea.rating || DEFAULT_RATING;
                vm.rating.averageRating = Math.round(vm.rating.averageRating * 10) / 10;
                vm.campaignId = $scope.campaign.id;
                vm.isVotingDisabled = !$scope.campaign.active || false;
                vm.rejectionComment = "";
                vm.isEditable = false;
                vm.isAdminView = $scope.admin || false;
              vm.isOwnView = $scope.own || false;

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
                                $rootScope.$broadcast('VOTE_'+vm.idea.id, { type:'success', message: $filter('translate')('IDEA_REMOVE_VOTE_MESSAGE')});
                            } else {
                                $rootScope.$broadcast('VOTE_'+vm.idea.id, { type:'success', message: $filter('translate')('IDEA_VOTE_MESSAGE')});
                            }
                            vm.rating = rating;
                          vm.rating.averageRating = Math.round(vm.rating.averageRating * 10) / 10;
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

                        $rootScope.$broadcast('VOTE_'+vm.idea.id, { type:'success', message: $filter('translate')('IDEA_UPDATE_MESSAGE') });
                        vm.isEditable = false;
                    })
                };

                vm.publish = function () {
                    if (!vm.isAdminView) {
                        throw Error('publishing is only allowed for admin');
                    }
                    Idea.publishIdea(vm.campaignId, vm.idea.id)
                        .then(function () {
                            $rootScope.$broadcast('ADMIN_'+vm.idea.id, { type:'success', message: $filter('translate')('ADMIN_IDEA_PUBLISH_MESSAGE') });
                            handleSuccessCallback();
                        });
                };

                vm.reject = function () {
                    if (!vm.isAdminView) {
                        throw Error('rejection is only allowed for admin');
                    }
                    Idea.rejectIdea(vm.campaignId, vm.idea.id, vm.rejectionComment)
                        .then(function () {
                            $rootScope.$broadcast('ADMIN_'+vm.idea.id, { type:'failure', message: $filter('translate')('ADMIN_IDEA_REJECT_MESSAGE') });
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

                function isTranslated(currentLanguage) {
                    var contentI18n = $scope.idea.contentI18n;
                    if(!contentI18n || !contentI18n.originalLanguage) {
                        return false;
                    }

                    if(contentI18n.originalLanguage.toLowerCase() != currentLanguage.toLowerCase()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                function selectTranslation(on) {
                    if(on) {
                        vm.isTranslationSelected = true;
                    } else {
                        vm.isTranslationSelected = false;
                    }

                    setIdeaTitleAndPitch();
                }

                function setIdeaTitleAndPitch() {
                    var contentI18n =  $scope.idea.contentI18n;

                    if(!contentI18n || !contentI18n.originalLanguage) {
                        vm.title = $scope.idea.title;
                        vm.pitch = $scope.idea.pitch;
                    }

                    else if (vm.isTranslated && vm.isTranslationSelected) {
                        vm.title = contentI18n[vm.currentLanguage].title;
                        vm.pitch = contentI18n[vm.currentLanguage].pitch;
                    }
                    else {
                        vm.title = contentI18n.original.title;
                        vm.pitch = contentI18n.original.pitch;
                    }
                }

                function resetTranslation() {
                    vm.isTranslated = isTranslated(vm.currentLanguage);
                    vm.isTranslationSelected = true;
                    setIdeaTitleAndPitch();
                }
            }
        };
    });