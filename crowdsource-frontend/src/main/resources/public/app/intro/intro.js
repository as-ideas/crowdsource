angular.module('crowdsource')

    .controller('IntroController', function (Authentication) {
        var vm = this;
        vm.auth = Authentication;
    });
