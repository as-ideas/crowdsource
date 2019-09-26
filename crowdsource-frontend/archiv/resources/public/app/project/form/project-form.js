angular.module('crowdsource')

    .controller('ProjectFormController', function ($location, $routeParams, Project,
                                                   RemoteFormValidation) {

        var vm = this;

        vm.md = {
            preview: false
        };

        vm.project = {};

        vm.isEditMode = function () {
            return $routeParams.projectId !== undefined;
        };

        vm.isCreateMode = function () {
            return !vm.isEditMode();
        };

        vm.init = function () {
            if (!vm.isEditMode()) {
                return;
            }
            vm.project = Project.get($routeParams.projectId).then(
                function(project){
                    vm.project = project;
                }, function(response)  {
                    if (response.status == 404) {
                        $location.path('/error/notfound');
                    }
                    else if (response.status == 403) {
                        $location.path('/error/forbidden');
                    }
                    else {
                        $location.path('/error/unknown');
                    }
                }
            );
        };

        vm.switchPreview = function(){
            vm.md.preview = !vm.md.preview;
        };

        vm.submitProject = function () {
            if (!vm.form.$valid) {
                return;
            }

            RemoteFormValidation.clearRemoteErrors(vm);
            vm.loading = true;

            var projectRequest;
            if (vm.isCreateMode()) {
                projectRequest = Project.add(vm.project);
            } else {
                projectRequest = Project.edit(vm.project);
            }

            projectRequest.then(function (savedProject) {
                if(vm.isCreateMode()) {
                    $location.path('/project/new/' + savedProject.id);
                }else {
                    $location.path('/project/' + savedProject.id);
                }
            }).catch(function (response) {
                RemoteFormValidation.applyServerErrorResponse(vm, vm.form, response);
            }).finally(function () {
                vm.loading = false;
            });
        };

    });
