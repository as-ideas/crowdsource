angular.module('crowdsource')

    .directive('statusBar', function ($rootScope, $window, Route, Authentication, FinancingRound) {
        return {
            controllerAs: 'status',
            bindToController: true,
            templateUrl: 'app/components/layout/status-bar/status-bar.html',
            controller: function () {
                var vm = this;

                vm.auth = Authentication;

                vm.financingRound = FinancingRound;

                vm.postRoundBudgetDistributable = function () {
                    var mostRecentRound = vm.financingRound.currentFinancingRound();
                    return mostRecentRound.postRoundBudgetDistributable &&
                        vm.auth.currentUser.hasRole('ADMIN');
                };

                Route.onRouteChangeSuccessAndInit(function (event, current) {
                    updateView(current);
                });

                function updateView(currentRoute) {
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
