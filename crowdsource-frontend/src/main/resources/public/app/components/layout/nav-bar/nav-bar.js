angular.module('crowdsource')

    .directive('navBar', function ($location, $window, Authentication, Route, Idea, ROUTE_DETAILS) {
        var directive = {};

        directive.controllerAs = 'nav';
        directive.bindToController = true;
        directive.templateUrl = 'app/components/layout/nav-bar/nav-bar.html';
        directive.link = function(scope, elem, attrs){

        }

        directive.controller = function ($scope) {
            var vm = this;

            vm.auth = Authentication;
            vm.breadcrumbs = [];
            vm.localNavItems = [];

            // Watch for changes in the service
            $scope.$watch(function(){
                return Idea.currentCampaign;
            }, watcher)

            function updateWindowTitle(breadcrumb) {

                var prefix = "CrowdSource - ";
                var breadcrumbTitles = [];

                for (var i=0; i<breadcrumb.length; i++) {
                    breadcrumbTitles.push(breadcrumb[i].label);
                }

                var title = prefix + breadcrumbTitles.join(" - ");
                console.log(title);
                $window.document.title = title;
            }

            function updateNavigationAndWindowTitle(currentRoute) {
                vm.breadcrumbs = [];
                vm.localNavItems = [];

                if(isIdeasCampaign(currentRoute)) {
                    if (Idea.currentCampaign) {
                        console.log("YEAH CAMPAIGN")
                        vm.breadcrumbs = getIdeasBreadcrumb(currentRoute);
                        vm.localNavItems = getIdeasLocalNavItems();

                    }
                    else {
                        console.log("no campaign");
                    }
                }

                else {
                    vm.breadcrumbs.push({target: '#', label: currentRoute.title});
                }

                updateWindowTitle(vm.breadcrumbs);
            }

            function getIdeasBreadcrumb(currentRoute) {
                var breadcrumbs = [];
                breadcrumbs.push({target: '/#/ideas/' + Idea.currentCampaign.id, label: Idea.currentCampaign.title});

                if (currentRoute[ROUTE_DETAILS.JSON_ROOT]
                    && currentRoute[ROUTE_DETAILS.JSON_ROOT][ROUTE_DETAILS.ATTR_IS_OVERVIEW]
                    && currentRoute[ROUTE_DETAILS.JSON_ROOT][ROUTE_DETAILS.ATTR_IS_OVERVIEW] == true)
                    return breadcrumbs;

                console.log("ok")
                breadcrumbs.push({target: '#', label: currentRoute.title});
                return breadcrumbs;
            }

            function getIdeasLocalNavItems() {
                var localNavItems = [];
                localNavItems.push({target: '/#/ideas/' + Idea.currentCampaign.id + '/own', label: 'Deine Ideen'});
                if(Authentication.isAdmin()) localNavItems.push({target: '/#/ideas/' + Idea.currentCampaign.id + '/admin', label: 'Admin'});
                return localNavItems;
            }

            function isIdeasCampaign(currentRoute){
                if (!currentRoute[ROUTE_DETAILS.JSON_ROOT]) return false;
                if (!currentRoute[ROUTE_DETAILS.JSON_ROOT][ROUTE_DETAILS.ATTR_CAMPAIGN]) return false;
                if (!currentRoute[ROUTE_DETAILS.JSON_ROOT][ROUTE_DETAILS.ATTR_CAMPAIGN] == ROUTE_DETAILS.VALUE_CAMPAIGN_IDEA) return false;
                console.log("isIdeasCampaign: true");
                return true;
            }

            function watcher(newValue, oldValue, scope) {
                console.log("new value: " + newValue);
                console.log("old value: " + oldValue);

                if(vm.currentRoute) {
                    updateNavigationAndWindowTitle(vm.currentRoute);
                }
            }

            Route.onRouteChangeSuccessAndInit(function (event, currentRoute) {
                if (typeof (currentRoute) !== 'undefined' && currentRoute.title) {

                    vm.currentRoute = currentRoute;
                    //console.log("currentRoute: " + JSON.stringify(currentRoute));
                    updateNavigationAndWindowTitle(currentRoute);
                }
            });
        };

        return directive;
    });
