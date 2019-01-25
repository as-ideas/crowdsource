angular.module('crowdsource')
    .controller('IdeasAdminController', function (campaign, Idea) {
        var vm = this;
        vm.campaign = campaign;
        vm.ideas = Idea.getAll();
});
