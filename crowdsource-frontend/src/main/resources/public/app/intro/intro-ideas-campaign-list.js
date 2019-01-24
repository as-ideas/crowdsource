angular.module('crowdsource')
    .directive('introIdeasCampaignList', function (Idea) {

        return {
            restrict: 'E',
            templateUrl: 'app/intro/intro-ideas-campaign-list.html',
            controllerAs: 'list',
            bindToController: true,
            controller: function () {
                var vm = this;
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