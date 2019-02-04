angular.module('crowdsource')
    .directive('ideasStatusBar', function ($rootScope, $window, Route, Authentication) {
        return {
            restrict: 'E',
            scope: {
                'campaign': '='
            },
            controllerAs: 'status',
            bindToController: true,
            templateUrl: 'app/ideas/ideas-status-bar/ideas-status-bar.html',
            controller: function () {
                var vm = this;
                vm.breadcrumbs = [];
                vm.userIsAdmin = Authentication.isAdmin();

                if (!vm.campaign) {
                    throw Error('ideas-status-bar: missing campaign on scope in directive');
                }

                function updateTitle(title) {
                    var newTitle = "CrowdSource";
                    var campaignTitle = vm.campaign.title || '';
                    if (campaignTitle) {
                        newTitle = [newTitle, title, campaignTitle].join(" - ");
                    }
                    $window.document.title = newTitle;
                }

                function updateBreadcrumb(title) {
                    console.log("Title: " + title);
                    vm.breadcrumbs = [];
                    vm.breadcrumbs.push({target: '/#/intro', label: 'Kampagnen'});
                    vm.breadcrumbs.push({target: '/#/ideas/' + vm.campaign.id, label: vm.campaign.title});
                    vm.breadcrumbs.push({target: '', label: title});
                }

                Route.onRouteChangeSuccessAndInit(function (event, currentRoute) {
                    if (typeof (currentRoute) !== 'undefined' && currentRoute.title) {
                        updateBreadcrumb(currentRoute.title);
                        updateTitle(currentRoute.title);
                    }
                });
            }
        };
    });
