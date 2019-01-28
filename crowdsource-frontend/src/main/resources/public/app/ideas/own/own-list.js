angular.module('crowdsource')
    .controller('IdeasOwnController', function (campaign, Idea) {
        var vm = this;
        vm.ideas = Idea.getOwnIdeas();
        vm.campaign = campaign;
});
