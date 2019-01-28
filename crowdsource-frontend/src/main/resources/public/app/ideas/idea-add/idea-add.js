angular.module('crowdsource')
    .directive('ideaAdd', function (Idea, $timeout) {

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
                vm.showSuccessMessage = false;
                vm.contentPresent = true;
                vm.campaign = $scope.campaign;

                if (!vm.campaign) {
                    throw Error('idea-add: missing campaign on scope in directive');
                }

                vm.newIdea = newIdea();
                vm.send = saveIdea;

                function newIdea() {
                    return {
                        pitch: "",
                        title: ""
                    };
                }

                $scope.$watch('vm.newIdea', function() {
                    vm.contentPresent = vm.newIdea.title !== "" && vm.newIdea.pitch !== "";
                }, true);

                function saveIdea() {
                    vm.pending = true;
                    vm.failed = false;
                    vm.showSuccessMessage = false;

                    Idea.createIdea(vm.campaign.id, vm.newIdea).then(function () {
                        vm.pending = false;
                        vm.newIdea = newIdea();
                        vm.showSuccessMessage = true;
                        $timeout(function(){ vm.showSuccessMessage = false; }, 1500);
                    }, function (err) {
                        vm.failed = true;
                        vm.pending = false;
                        vm.showSuccessMessage = false;
                    })
                }
            }
        };
    });