angular.module('crowdsource')

    .controller('UserSignupController', function ($location, User, RemoteFormValidation) {

        var vm = this;

        vm.signUp = function () {
            if (!vm.form.$valid) {
                return;
            }

            RemoteFormValidation.clearRemoteErrors(vm);
            vm.loading = true;

            var promise = User.register(vm.user);
            promise.then(function () {
                $location.path('/signup/' + vm.user.email + '/' + vm.user.firstName + '/' + vm.user.lastName + '/success');
            });
            promise.catch(function (response) {
                RemoteFormValidation.applyServerErrorResponse(vm, vm.form, response);
            });
            promise.finally(function () {
                vm.loading = false;
            });
        };
    });
