angular.module('crowdsource')
    .controller('IdeasAdminController', function (Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.ideas = Idea.getAll();
});
