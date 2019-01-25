angular.module('crowdsource')
    .directive('ideasStatusBar', function ($rootScope, $window, Route, Authentication) {
        return {
            restrict: 'E',
            scope: {
                'campaign':'='
            },
            controllerAs: 'status',
            bindToController: true,
            templateUrl: 'app/components/layout/ideas-status-bar/ideas-status-bar.html',
            controller: function () {
                var vm = this;
                vm.breadcrumbs = [];
                vm.userIsAdmin = Authentication.isAdmin();
                vm.campaignRunning = campaignIsRunning();

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
                    vm.breadcrumbs = [];
                    vm.breadcrumbs.push({target:'/#/intro', label:'CROWD'});
                    vm.breadcrumbs.push({target:'/#/ideas', label:title});
                    vm.breadcrumbs.push({target:'/#/ideas/' + vm.campaign.id, label:vm.campaign.title});
                }

                function campaignIsRunning() {
                    var nowMs = new Date().getDate();
                  var endDateMs = (vm.campaign && vm.campaign.endDate) ? vm.campaign.endDate : 0;
                    return nowMs > endDateMs;
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
