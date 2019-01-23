angular.module('crowdsource')

    .controller('IntroController', function (Project, Idea, Authentication) {
        var vm = this;
        vm.auth = Authentication;

        vm.campaigns = {
            ideas: [],
            prototypes: []
        };

        activate();


        function activate() {
            getIdeaCampaigns();
            getPrototypeCampaigns();
        }


        function getPrototypeCampaigns() {
            Project.getCampaigns().then(function(res) {
                vm.campaigns.prototypes = res;
            }, function() {
                vm.campaigns.prototypes = [];
            });
        }

        function getIdeaCampaigns() {
            Idea.getCampaigns().then(
                function(response) {
                    vm.campaigns.ideas = response;
                },
                function() {
                    vm.campaigns.ideas = []
                }
            );

        }
    });
