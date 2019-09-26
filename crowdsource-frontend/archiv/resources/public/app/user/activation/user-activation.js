angular.module('crowdsource')

    .controller('UserActivationController', function ($routeParams, $location, User, Authentication, RemoteFormValidation) {

        var vm = this;

        vm.user = {
            email: $routeParams.email,
            activationToken: $routeParams.activationToken
        };

        vm.isPasswordRecoveryFlow = ($location.path().indexOf('password-recovery') !== -1);
        vm.isRegistrationFlow = !vm.isPasswordRecoveryFlow;

        vm.activate = function () {
            if (!vm.form.$valid) {
                return;
            }

            if (vm.user.password != vm.user.repeatedPassword) {
                vm.form.repeatedPassword.$setValidity('remote_equal', false);
                return;
            }

            RemoteFormValidation.clearRemoteErrors(vm);
            vm.loading = true;

            User.activate(vm.user).$promise
                .then(function () {
                    return Authentication.login(vm.user.email, vm.user.password);
                })
                .then(function () {
                    $location.path('/');
                })
                .catch(function (response) {
                    RemoteFormValidation.applyServerErrorResponse(vm, vm.form, response);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    });