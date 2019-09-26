angular.module('crowdsource')

    .controller('ProjectDetailsController', function ($window, $routeParams, $location, $q, Project, FinancingRound, Authentication) {

        var vm = this;

        vm.auth = Authentication;

        // set the project id beforehand to allow the project-comments directive
        // to already load the comments for this project, else it must wait until
        // the GET /project/:id response is finished
        vm.project = {id: $routeParams.projectId};

        activate();

        function activate() {
            var deferred = $q.defer();
            Project.get($routeParams.projectId).then(
                function (res) {
                    vm.project = res;
                    deferred.resolve(res);
                }, function (errorResp) {
                    if (errorResp.status == 404) {
                        $location.path('/error/notfound');
                    }
                    else if (errorResp.status == 403) {
                        $location.path('/error/forbidden');
                    }
                    else {
                        $location.path('/error/unknown');
                    }
                });
            var res = deferred.promise;
            res.id = $routeParams.projectId;
            vm.project = res;
            return res;
        }

        vm.publish = function () {
            if (!$window.confirm('Willst Du das Projekt wirklich veröffentlichen?')) {
                return;
            }

            vm.publishing = true;
            var promise = Project.publish(vm.project.id).$promise;
            handleResponse(promise);
            promise.finally(function () {
                vm.publishing = false;
            });

        };
        vm.publishAndDefer = function () {
            if (!$window.confirm('Willst Du das Projekt wirklich veröffentlichen und zurückstellen?')) {
                return;
            }

            vm.publishingAndDeferring = true;
            var promise = Project.publishAndDefer(vm.project.id).$promise;
            handleResponse(promise);
            promise.finally(function () {
                vm.publishingAndDeferring = false;
            });
        };

        vm.reject = function () {
            if (!$window.confirm('Willst Du das Projekt wirklich ablehnen?')) {
                return;
            }

            vm.rejecting = true;
            var promise = Project.reject(vm.project.id).$promise;
            handleResponse(promise);
            promise.finally(function () {
                vm.rejecting = false;
            });
        };

        vm.defer = function () {
            if (!$window.confirm('Willst Du das Projekt wirklich aus der nächsten Finanzierungsrunde ausschließen?')) {
                return;
            }

            vm.deferring = true;
            var promise = Project.defer(vm.project.id).$promise;
            handleResponse(promise);
            promise.finally(function () {
                vm.deferring = false;
            });
        };

        vm.goToEdit = function () {
            var path = '/project/' + vm.project.id + '/edit';
            $location.path(path);
        };

        vm.isPublishable = function () {
            if (!vm.project.$resolved) {
                return false;
            }
            return vm.project.status == 'PROPOSED' || vm.project.status == 'REJECTED'
                || vm.project.status == 'DEFERRED' || vm.project.status == 'PUBLISHED_DEFERRED';
        };

        vm.isRejectable = function () {
            if (!vm.project.$resolved) {
                return false;
            }
            return vm.project.status == 'PROPOSED' || vm.project.status == 'PUBLISHED' || vm.project.status == 'PUBLISHED_DEFERRED';
        };

        vm.isDeferrable = function () {
            if (!vm.project.$resolved) {
                return false;
            }
            return (vm.project.status == 'PROPOSED' || vm.project.status == 'PUBLISHED' || vm.project.status == 'PUBLISHED_DEFERRED')
                && !FinancingRound.currentFinancingRound().active;
        };

        vm.isPublishDeferrable = function () {
            if (!vm.project.$resolved) {
                return false;
            }
            if (vm.project.status == "FULLY_PLEDGED" || vm.project.status == 'PUBLISHED_DEFERRED') {
                return false;
            }
            if (FinancingRound.currentFinancingRound().active && vm.project.status == 'PUBLISHED') {
                return false;
            }
            return true;
        };

        vm.toPledgingFormButtonDisabled = function () {
            return vm.project.status == 'FULLY_PLEDGED' || vm.project.status == 'REJECTED'
                || vm.project.status == 'DEFERRED' || vm.project.status == 'PROPOSED'
                || vm.project.status == 'PUBLISHED_DEFERRED';
        };

        vm.editButtonVisibleForUser = function () {
            return Project.userEligibleToEdit(vm.project, vm.auth.currentUser);
        };

        vm.editButtonEnabled = function () {
            return Project.isEditable(vm.project);
        };

        function handleResponse(promise) {
            promise.then(function (project) {
                    vm.project = project;
                })
                .catch(function () {
                    $location.path('/error/unknown');
                });
            return promise;
        }

    });
