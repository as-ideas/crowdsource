angular.module('crowdsource')
    .directive('ideasTeaser', function () {
        return {
            restrict: 'E',
            controllerAs: 'teaser',
            bindToController: true,
            templateUrl: 'app/components/layout/ideas-teaser/ideas-teaser.html',
            controller: function () {
                var vm = this;
            }
        };
    });
