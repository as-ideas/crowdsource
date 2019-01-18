angular.module('crowdsource')
    .directive('ideasStatusBar', function ($rootScope, $window, Route, Authentication) {
        return {
            restrict: 'E',
            controllerAs: 'status',
            bindToController: true,
            templateUrl: 'app/components/layout/ideas-status-bar/ideas-status-bar.html',
            controller: function () {
                var vm = this;

                Route.onRouteChangeSuccessAndInit(function (event, currentRoute) {
                    updateView(currentRoute);
                });

                function updateView(currentRoute) {
                    console.log("ideas-status-bar")
                    var title = "CrowdSource";
                    if (typeof (currentRoute) !== 'undefined' && currentRoute.title) {
                        title += " - " + currentRoute.title;
                        vm.breadcrump = currentRoute.title;
                    } else {
                        vm.breadcrump = "";
                    }

                    $window.document.title = title;
                }

            }
        };
    });
