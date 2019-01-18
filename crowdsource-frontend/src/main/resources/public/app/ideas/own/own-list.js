angular.module('crowdsource')
    .controller('IdeasOwnController', function (Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.ideas = Idea.getAll();
});
