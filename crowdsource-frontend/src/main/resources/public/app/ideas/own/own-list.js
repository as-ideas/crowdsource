angular.module('crowdsource')
    .controller('IdeasOwnController', function (campaign, Idea) {
        var vm = this;
        vm.ideas = [];
        vm.campaign = campaign;
        vm.refreshList = refreshList;

        init();

        function init() {
            fetchIdeas();
        }

        function fetchIdeas() {
            Idea.getOwnIdeas(campaign.id).then(function (res) {
                vm.ideas = res;
            });
        }

        function refreshList(res) {
            fetchIdeas();
        }
    });
