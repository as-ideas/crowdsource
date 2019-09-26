angular.module('crowdsource')

    .controller('UserLogoutController', function (Authentication) {

        Authentication.logout();
    });