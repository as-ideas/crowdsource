angular.module('crowdsource')
    .controller('IdeasListController', function (Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.ideas = Idea.getAll();
});
