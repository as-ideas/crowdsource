angular.module('crowdsource')
    .controller('IdeasAdminController', function (campaign, Idea) {
        var vm = this;
        vm.campaign = campaign;
        vm.pendingIdeas = Idea.getAll();
        vm.rejectedIdeas = Idea.getAll();
    });
