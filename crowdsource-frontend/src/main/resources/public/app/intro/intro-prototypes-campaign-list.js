angular.module('crowdsource')
    .directive('introPrototypesCampaignList', function (Project) {

        return {
            restrict: 'E',
            templateUrl: 'app/intro/intro-prototypes-campaign-list.html',
            controllerAs: 'list',
            bindToController: true,
            controller: function () {
                var vm = this;
                vm.entries = [];

                getPrototypeCampaigns();

                function getPrototypeCampaigns() {
                    Project.getCampaigns().then(function(res) {
                        vm.entries = res;
                    }, function() {
                        vm.entries = [];
                    });
                }
            }
        };
    });