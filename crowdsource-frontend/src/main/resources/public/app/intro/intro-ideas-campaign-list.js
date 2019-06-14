angular.module('crowdsource')
    .directive('introIdeasCampaignList', function (Idea) {

        return {
            restrict: 'E',
            templateUrl: 'app/intro/intro-ideas-campaign-list.html',
            controllerAs: "list",
            scope: {},
            bindToController: true,
            controller: function ($scope, $rootScope, $translate) {
                var vm = this;

                $rootScope.$on('$translateChangeSuccess', function (event,data) {
                  //vm.currentLanguage = data.language;
                  vm.currentLanguage = "original";
                    console.log("language change: " + vm.currentLanguage);
                });

//                vm.currentLanguage = $translate.use();
              vm.currentLanguage = "original";
                vm.entries = [];

                getIdeaCampaigns();

                function getIdeaCampaigns() {
                    Idea.getCampaigns().then(
                        function(response) {
                            vm.entries = response;
                        },
                        function() {
                            vm.entries = []
                        }
                    );

                }
            }
        };
    });