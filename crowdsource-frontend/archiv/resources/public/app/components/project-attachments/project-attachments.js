angular.module('crowdsource')
    /**
     * Manages project file attachments. Supports display and Upload.
     */
    .directive('projectAttachments', function () {
        return {
            restrict: 'E',
            scope: {
                project: '=',
                uploadEnabled: '='
            },
            templateUrl: 'app/components/project-attachments/project-attachments.html',

            controller: function ($scope, Upload, $timeout, $location, RemoteFormValidation, Project, Bowser) {
                var vm = $scope;
                vm.bowser = Bowser;

                vm.uploads = {
                    currentAttachment: undefined,
                    lastUploadSuccessful: undefined,
                    lastDeletionSuccessful: undefined,
                    deletionsInProgress: [],
                    currentErrorContext: 'upload'
                };

                $scope.$watch("project", function (project) {
                    if (project == undefined) {
                        return;
                    }
                    // Resolve project when deferred by parent scope in order to refresh this form correctly
                    vm.project = project;
                });

                vm.uploadAttachment = function (file) {
                    file.upload = Upload.upload({
                        url: '/projects/' + vm.project.id + '/attachments',
                        data: {file: file, id: vm.project.id},
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                            vm.uploads.lastUploadSuccessful = true;
                            vm.uploads.currentAttachment = null;
                            vm.clearErrors();
                            vm.reloadProject();
                        }, 0);
                    }, function (response) {
                        if (response.status > 0) {
                            vm.uploads.currentErrorContext = 'upload';
                            vm.uploads.lastUploadSuccessful = false;
                            RemoteFormValidation.applyServerErrorResponse(vm, vm.attachments_form, response);
                            vm.errorMsg = response.data;
                        }
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                };

                vm.deleteAttachment = function (attachment) {
                    if (vm.uploads.deletionsInProgress.indexOf(attachment.id) > -1) {
                        return; // alreadyInProgress
                    }
                    vm.uploads.deletionsInProgress.push(attachment.id);
                    Project.deleteProjectAttachment(vm.project.id, attachment.id).then(function () {
                        removeFromDeletionInProgress(attachment.id);
                        vm.uploads.lastDeletionSuccessful = true;
                        vm.clearErrors();
                        vm.reloadProject();
                    }, function (response) {
                        removeFromDeletionInProgress(attachment.id);
                        vm.uploads.currentErrorContext = 'deletion';
                        vm.uploads.lastDeletionSuccessful = false;
                        RemoteFormValidation.applyServerErrorResponse(vm, vm.delete_attachments_form, response);
                    });
                };

                vm.clearErrors = function () {
                    RemoteFormValidation.clearRemoteErrors(vm);
                };

                vm.reloadProject = function () {
                    Project.get(vm.project.id).then(function (resolvedProject) {
                        angular.copy(resolvedProject, vm.project);
                    })
                };

                vm.absoluteFileUrl = function (attachment) {
                    return $location.protocol() + "://" + $location.host() + ":" + $location.port()
                        + attachment.linkToFile;
                };

                vm.markdownImageInclude = function (attachment) {
                    var res = "![" + attachment.name + "](" + vm.absoluteFileUrl(attachment) + ")";
                    return res;
                };

                function removeFromDeletionInProgress(id){
                    var index = vm.uploads.deletionsInProgress.indexOf(id);
                    if(index > -1){
                        vm.uploads.deletionsInProgress.splice(index, 1);
                    }
                }

            }
        };
    })

    .filter('bytesAsMegabytes', function ($filter) {

        return function (input) {
            return $filter('number')(input / 1024 / 1024, 2);
        };

    });