angular.module('crowdsource')

    .directive('navBar', function () {
        var directive = {};

        directive.templateUrl = 'app/components/layout/nav-bar/nav-bar.html';
        directive.controllerAs = 'vm';
        directive.bindToController = true;
        directive.controller = ['$scope','$rootScope','$window','$filter', '$translate','$location','tmhDynamicLocale','Authentication','Route','Idea','ROUTE_DETAILS','Analytics', NavBarController]

        function NavBarController($scope, $rootScope, $window, $filter, $translate, $location, tmhDynamicLocale, Authentication, Route, Idea, ROUTE_DETAILS, Analytics) {
            var vm = this;
            vm.currentLanguage = $translate.use();

            $rootScope.$on('$translateChangeSuccess', function (event, data) {
                // Set language var for UI
                vm.currentLanguage = data.language;
                updateNavigationAndWindowTitle(vm.currentRoute);
            });

            vm.auth = Authentication;
            vm.breadcrumbs = [];
            vm.localNavItems = [];
            vm.isMobile = isMobileSize();
            vm.isMobileMenuOpen = false;
            vm.toggleMobileMenu = toggleMobileMenu;
            vm.closeMobileMenu = closeMobileMenu;0

            vm.changeLanguage = function(langKey) {
                // Set Angular locale
                tmhDynamicLocale.set(langKey);

                // Set angular-translate language
                $translate.use(langKey);

                // Close Mobile Menu (if open)
                vm.closeMobileMenu();
            }

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
              return $window.innerWidth < 1024 ? true : false;
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
                    vm.breadcrumbs.push({ target: '#', label: $filter('translate')(currentRoute.title) });
                }

                updateWindowTitle(vm.breadcrumbs);
            }

            function getIdeasBreadcrumb(currentRoute) {
                var breadcrumbs = [];
                if(vm.currentLanguage) {
                    breadcrumbs.push({target: '/#/ideas/' + Idea.currentCampaign.id, label: Idea.currentCampaign.contentI18n[vm.currentLanguage].title});
                } else {
                    console.log("nav-bar.js vm.currentLanguage undefined yet");
                }

                if (currentRoute[ROUTE_DETAILS.JSON_ROOT]
                    && currentRoute[ROUTE_DETAILS.JSON_ROOT][ROUTE_DETAILS.ATTR_IS_OVERVIEW]
                    && currentRoute[ROUTE_DETAILS.JSON_ROOT][ROUTE_DETAILS.ATTR_IS_OVERVIEW] == true)
                    return breadcrumbs;

                breadcrumbs.push({target: '#', label: $filter('translate')(currentRoute.title) });
                return breadcrumbs;
            }

            function getIdeasLocalNavItems() {
                var localNavItems = [];
                localNavItems.push({target: '/#/ideas/' + Idea.currentCampaign.id + '/own', label: 'NAV_LABEL_IDEAS_OWN'});
                if(Authentication.isAdmin()) localNavItems.push({target: '/#/ideas/' + Idea.currentCampaign.id + '/admin', label: 'NAV_LABEL_ADMIN'});
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

                    // Google Tracking
                    Analytics.trackPage($location.$$path);
                }
            });
        };

        return directive;
    });
