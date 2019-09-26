angular.module('crowdsource')

    .controller('PasswordRecoverySuccessController', function ($routeParams) {

        this.email = $routeParams.email;
    });
