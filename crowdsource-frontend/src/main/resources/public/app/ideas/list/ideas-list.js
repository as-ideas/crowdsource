angular.module('crowdsource')
    .controller('IdeasListController', function (campaign, Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.campaign = campaign;
        vm.ideas = Idea.getAll();
    });
