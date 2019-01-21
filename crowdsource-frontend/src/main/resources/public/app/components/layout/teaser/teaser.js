angular.module('crowdsource')

    .directive('teaser', function ($interval, $timeout, Authentication, Route, TeaserMetrics, ServerTime, User, FinancingRound) {
        var directive = {};

        directive.controllerAs = 'teaser';
        directive.bindToController = true;
        directive.templateUrl = 'app/components/layout/teaser/teaser.html';

        directive.controller = function () {
            var vm = this;

            var serverTime = {$resolved: false};

            vm.show = false;

            // initialize to a string that evaluates to true to show the
            // 3 metrics items while loading instead of only two
            vm.remainingTime = " ";

            Route.onRouteChangeSuccessAndInit(function (event, current) {
                var currentRoute = current || {};
                render(currentRoute);
            });

            $interval(applyRemainingTime, 1000);

            function render(currentRoute, wasPageLoad) {
                vm.show = currentRoute.showTeaser;

                if (currentRoute.showTeaser) {
                    // refresh the data every time a route is changed and
                    // the teaser should be shown
                    loadData(wasPageLoad);
                }
            }

            function loadData() {
                User.getMetrics().$promise.then(function (metrics) {
                    // overwrite the reference when the response arrived to prevent flickering
                    vm.userMetrics = metrics;
                });

                ServerTime.reloadReferenceTime().$promise.then(function (response) {
                    // overwrite the reference when the response arrived to prevent flickering
                    serverTime = response;
                });

                FinancingRound.reloadCurrentRound().then(function () {
                    // recalculate the remaining time right when the data is available,
                    // else it is first updated when the next $interval kicks in
                    applyRemainingTime();
                });
            }

            function applyRemainingTime() {
                if (!FinancingRound.currentFinancingRound().$resolved || !serverTime.$resolved) {
                    return;
                }

                if (FinancingRound.currentFinancingRound().active) {
                    vm.remainingTime = TeaserMetrics.formatRemainingTime(ServerTime.getInterpolatedTimeOfServer(), FinancingRound.currentFinancingRound().endDate);
                }
                else {
                    vm.remainingTime = null;
                }

                // financing round time is now over
                if (FinancingRound.currentFinancingRound().active && !vm.remainingTime) {
                    // reload the data 500ms later (because the time of the browser could be out of sync with the server time)
                    $timeout(function () {
                        // reload the metrics to see if the financing round is really over
                        loadData();

                        // update the user's budget
                        Authentication.reloadUser();
                    }, 500);
                }
            }
        };

        return directive;
    })

    .factory('TeaserMetrics', function () {
        var service = {};

        service.formatRemainingTime = function (fromDate, untilDate) {
            var start = moment(fromDate);
            var end = moment(untilDate);

            var diff = moment.duration(end.diff(start));
            if (diff.asSeconds() < 1) {
                return null;
            }

            var remainingTime = '';
            if (diff.asDays() > 0) {
                var days = Math.floor(diff.asDays());
                if (days > 6) {
                    return days + ' Tage';
                } else if (days > 0) {
                    remainingTime += days + 'd ';
                }
            }
            if (remainingTime || diff.hours() > 0) {
                remainingTime += diff.hours() + 'h ';
            }
            if (remainingTime || diff.minutes() > 0) {
                remainingTime += diff.minutes() + 'm ';
            }
            remainingTime += diff.seconds() + 's';

            return remainingTime;
        };

        return service;
    });
