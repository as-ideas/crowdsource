angular.module('crowdsource')

    .controller('UserSignupSuccessController', function ($routeParams) {

        this.firstName = $routeParams.firstName;
        this.lastName = $routeParams.lastName;
        this.email = $routeParams.email;
    });
