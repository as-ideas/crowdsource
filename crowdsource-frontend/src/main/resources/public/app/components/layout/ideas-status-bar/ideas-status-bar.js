angular.module('crowdsource')
    .directive('ideasStatusBar', function ($rootScope, $window, Route, Authentication) {
        return {
            controllerAs: 'status',
            bindToController: true,
            templateUrl: 'app/components/layout/ideas-status-bar/ideas-status-bar.html',
            controller: function () {
                var vm = this;
            }
        };
    });
