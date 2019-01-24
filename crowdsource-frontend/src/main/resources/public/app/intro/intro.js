angular.module('crowdsource')
    .controller('IntroController', function (Authentication) {
        var vm = this;
        vm.isLoggedIn = Authentication.currentUser.loggedIn;
    });
