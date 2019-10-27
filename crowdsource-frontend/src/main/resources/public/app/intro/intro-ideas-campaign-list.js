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

                $rootScope.$on('$translateChangeSuccess', function (event, data) {
                    vm.currentLanguage = data.language;
                    console.log("language change: " + vm.currentLanguage);
                });

                vm.currentLanguage = $translate.use();
                vm.entriesOngoing = [];
                vm.entriesFinished = [];

                vm.hasNoCampaigns = function () {
                    return ((!vm.entriesOngoing) && (!vm.entriesFinished))
                };

                getIdeaCampaigns();

                function getIdeaCampaigns() {
                    Idea.getCampaigns().then(
                        function (response) {
                            var entries = response;
                            vm.entriesOngoing = entries.filter(function (entry) {
                                return !entry.expired;
                            });
                            vm.entriesFinished = entries.filter(function (entry) {
                                return entry.expired;
                            });
                        },
                        function () {
                            vm.entriesOngoing = [];
                            vm.entriesFinished = [];
                        }
                    );

                }
            }
        };
    });