angular.module('crowdsource')
    .directive('ideaAdd', function (Idea) {

        return {
            restrict: 'E',
            scope: {
                "campaign": "="
            },
            templateUrl: 'app/ideas/idea-add/idea-add.html',
            controllerAs: 'vm',
            controller: function ($scope) {
                var vm = this;
                vm.pending = false;
                vm.failed = false;
                vm.campaign = $scope.campaign;

                if (!vm.campaign) {
                    throw Error('idea-add: missing campaign on scope in directive');
                }

                vm.newIdea = newIdea();
                vm.send = saveIdea;

                function newIdea() {
                    return {
                        pitch: ""
                    };
                }

                function saveIdea() {
                    vm.pending = true;
                    vm.failed = false;
                    Idea.createIdea(vm.campaign.id, vm.newIdea).then(function() {
                        vm.pending = false;
                        vm.newIdea = newIdea();
                    }, function(err) {
                        console.log(err);
                        vm.failed = true;
                        vm.pending = false;
                    })
                }
            }
        };
    });