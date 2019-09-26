angular.module('crowdsource')

    .controller('ProjectFormSuccessController', function ($routeParams) {
        var vm = this;

        vm.projectId = $routeParams.projectId;
    });
