angular.module('crowdsource')
    .controller('IdeasListController', function (campaign, Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.campaign = campaign;
        vm.ideas = [];

        init();


        function init(){
            Idea.getAll(campaign.id).then(function(res) {
                vm.ideas = res.content;
            });
        }
    });
