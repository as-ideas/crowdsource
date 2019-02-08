angular.module('crowdsource')
    .directive('contentHero', function () {
        return {
            restrict: 'E',
            scope: {
                'title': '=',
                'description': '='
            },
            templateUrl: 'app/components/misc/content-hero/content-hero.html'
        };
    });