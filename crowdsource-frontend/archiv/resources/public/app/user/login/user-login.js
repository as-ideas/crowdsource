angular.module('crowdsource')

    .controller('UserLoginController', function (Authentication, RemoteFormValidation, Route) {

        var vm = this;

        vm.login = function () {
            if (!vm.form.$valid) {
                return;
            }

            RemoteFormValidation.clearRemoteErrors(vm);
            vm.loading = true;

            Authentication.login(vm.user.email, vm.user.password)
                .then(function () {
                    Route.redirectToOriginallyRequestedPageOr('/');
                })
                .catch(function (errorCode) {
                    RemoteFormValidation.setGeneralError(vm, errorCode);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    });