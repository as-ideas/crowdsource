angular.module('crowdsource')
    .directive('socialLinks', function () {
        return {
            restrict: 'E',
            scope: {
                'website': '@',
                'facebook': '@',
                'twitter': '@',
                'instagram': '@'
            },
            templateUrl: 'app/components/misc/social-links/social-links.html'
        };
    });