angular.module('crowdsource')
    .controller('IdeasOwnController', function (campaign, Idea) {
        var vm = this;
        vm.ideas = [];
        vm.campaign = campaign;

        init();

        function init() {
            Idea.getOwnIdeas(campaign.id).then(function(res) {
                vm.ideas = res;
            });
        }
});
