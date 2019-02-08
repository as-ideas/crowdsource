angular.module('crowdsource')

    .directive('navBar', function ($location, $window, Authentication, Route) {
        var directive = {};

        directive.controllerAs = 'nav';
        directive.bindToController = true;
        directive.templateUrl = 'app/components/layout/nav-bar/nav-bar.html';

        directive.controller = function () {
            var vm = this;

            vm.auth = Authentication;
            vm.breadcrumbs = [];

            vm.getClassForMenuItem = function (location) {
                if ($location.path() == location) {
                    return 'current';
                }

                return '';
            };

            function updateTitle(title) {
                /*
                var newTitle = "CrowdSource";
                var campaignTitle = vm.campaign.title || '';
                if (campaignTitle) {
                    newTitle = [newTitle, title, campaignTitle].join(" - ");
                }
                */
                $window.document.title = title;
            }

            function updateBreadcrumb(title) {
                vm.breadcrumbs = [];
                // vm.breadcrumbs.push({target: '/#/ideas/' + vm.campaign.id, label: vm.campaign.title});
                vm.breadcrumbs.push({target: '', label: title});
            }

            Route.onRouteChangeSuccessAndInit(function (event, currentRoute) {
                if (typeof (currentRoute) !== 'undefined' && currentRoute.title) {
                    console.log("title: " + currentRoute.title)
                    updateBreadcrumb(currentRoute.title);
                    updateTitle(currentRoute.title);
                }
            });
        };

        return directive;
    });
