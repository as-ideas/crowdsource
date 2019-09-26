angular.module('crowdsource')
    .directive('projectLikes', function () {

        var CONST = {
            LIKE: 'LIKE',
            UNLIKE: 'UNLIKE'
        };

        return {
            restrict: 'E',
            scope: {
                project: '=',
                view: '@'
            },
            templateUrl: 'app/components/project-likes/project-likes.html',
            controller: function ($scope, Project) {
                var vm = $scope;

                vm.showLikeCount = function () {
                    var count = vm.project.likeCount;
                    return count === undefined ? 0 : count;
                }

                vm.toggleLike = function () {
                    if (vm.project.likeStatus === CONST.LIKE) {
                        // unlike action
                        vm.project.likeCount --;
                        vm.project.likeStatus = CONST.UNLIKE;
                        Project.unlike(vm.project.id).then(function () {
                            vm._reloadProject();
                        });
                    } else {
                        // like action
                        vm.project.likeCount ++;
                        vm.project.likeStatus = CONST.LIKE;
                        Project.like(vm.project.id).then(function () {
                            vm._reloadProject();
                        });
                    }
                };

                vm._reloadProject = function () {
                    Project.get(vm.project.id).then(function (resolvedProject) {
                        angular.copy(resolvedProject, vm.project);
                    })
                };

            }

        };
    });