angular.module('crowdsource')
    .directive('introHero', function () {

        return {
            restrict: 'E',
            templateUrl: 'app/intro/intro-hero.html',
            controllerAs: "vm",
            bindToController: true,
            controller: function (Authentication) {
                var vm = this;
                vm.isLoggedIn = Authentication.currentUser.loggedIn;
            }
        };
    });