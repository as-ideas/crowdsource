angular.module('crowdsource')
    .controller('IdeasOwnController', function (campaign, Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.ideas = Idea.getAll();
      vm.campaign = campaign;
});
