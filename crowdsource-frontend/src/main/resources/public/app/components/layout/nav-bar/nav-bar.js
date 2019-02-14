angular.module('crowdsource')

    .directive('navBar', function () {
        var directive = {};

        directive.templateUrl = 'app/components/layout/nav-bar/nav-bar.html';
        directive.controllerAs = 'vm';
        directive.bindToController = true;
        directive.controller = ['$scope','$window','Authentication','Route','Idea','ROUTE_DETAILS', NavBarController]

        function NavBarController($scope, $window, Authentication, Route, Idea, ROUTE_DETAILS) {
            var vm = this;

            vm.auth = Authentication;
            vm.breadcrumbs = [];
            vm.localNavItems = [];
            vm.isMobile = isMobileSize();
            vm.isMobileMenuOpen = false;
            vm.toggleMobileMenu = toggleMobileMenu;
            vm.closeMobileMenu = closeMobileMenu;0

            // Watch for changes in the idea service
            $scope.$watch(function(){
                return Idea.currentCampaign;
            }, ideaServiceObserver)

            // Window resize listener for mobile menu
            $window.addEventListener('resize', function() {
                var oldValue = vm.isMobile;
                var newValue = isMobileSize();

                if(oldValue != newValue) {
                    vm.isMobile = newValue;
                    $scope.$digest();
                }
            })

            function isMobileSize() {
                return $window.innerWidth <= 768 ? true : false;
            };

            function toggleMobileMenu() {
                vm.isMobileMenuOpen = !vm.isMobileMenuOpen;
            }

            function closeMobileMenu() {
                vm.isMobileMenuOpen = false;
            }

            function updateWindowTitle(breadcrumb) {

                var prefix = "CrowdSource - ";
                var breadcrumbTitles = [];

                for (var i=0; i<breadcrumb.length; i++) {
                    breadcrumbTitles.push(breadcrumb[i].label);
                }

                var title = prefix + breadcrumbTitles.join(" - ");
                $window.document.title = title;
            }

            function updateNavigationAndWindowTitle(currentRoute) {
                vm.breadcrumbs = [];
                vm.localNavItems = [];

                if(isIdeasCampaign(currentRoute)) {
                    if (Idea.currentCampaign) {
                        vm.breadcrumbs = getIdeasBreadcrumb(currentRoute);
                        vm.localNavItems = getIdeasLocalNavItems();

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
                return true;
            }

            function ideaServiceObserver() {
                if(vm.currentRoute) {
                    updateNavigationAndWindowTitle(vm.currentRoute);
                }
            }

            Route.onRouteChangeSuccessAndInit(function (event, currentRoute) {
                if (typeof (currentRoute) !== 'undefined' && currentRoute.title) {

                    vm.currentRoute = currentRoute;
                    updateNavigationAndWindowTitle(currentRoute);
                }
            });
        };

        return directive;
    });
