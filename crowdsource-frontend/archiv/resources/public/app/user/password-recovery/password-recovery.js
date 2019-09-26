angular.module('crowdsource')

    .controller('PasswordRecoveryController', function ($location, User, RemoteFormValidation) {

        var vm = this;

        vm.recoverPassword = function () {
            if (!vm.form.$valid) {
                return;
            }

            RemoteFormValidation.clearRemoteErrors(vm);
            vm.loading = true;

            User.recoverPassword(vm.user.email).$promise
                .then(function () {
                    $location.path('/login/password-recovery/' + vm.user.email + '/success');
                })
                .catch(function (response) {
                    RemoteFormValidation.applyServerErrorResponse(vm, vm.form, response);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    });
