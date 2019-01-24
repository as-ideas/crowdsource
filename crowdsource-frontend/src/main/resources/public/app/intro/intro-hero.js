angular.module('crowdsource')
    .directive('introHero', function () {

        return {
            restrict: 'E',
            templateUrl: 'app/intro/intro-hero.html',
        };
    });