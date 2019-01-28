angular.module('crowdsource')
    .directive('ideaAdd', function (Idea, $timeout) {

        return {
            templateUrl: 'app/ideas/idea-add/idea-add.html',
            controllerAs: 'vm',
            scope: {
                campaign: "="
            },
            controller: function ($scope) {
                var vm = this;
                vm.pending = false;
                vm.failed = false;
                vm.showSuccessMessage = false;
                vm.contentPresent = true;
                vm.newIdea = {title: '', pitch: ''};

                vm.campaign = $scope.campaign;
                if (!vm.campaign) {
                    throw Error('idea-add: missing campaign on scope in directive');
                }

                resetNewIdea();
                vm.send = saveIdea;
                vm.enableButton = enableButton;

                function resetNewIdea() {
                    vm.newIdea.pitch = "";
                    vm.newIdea.title = "";
                }

                function enableButton() {
                    return !vm.pending &&
                        (vm.newIdea.title && vm.newIdea.title.length >= 5) &&
                        (vm.newIdea.pitch && vm.newIdea.pitch.length >= 5);
                }

                function saveIdea() {
                    vm.pending = true;
                    vm.failed = false;
                    vm.showSuccessMessage = false;

                    Idea.createIdea(vm.campaign.id, vm.newIdea).then(function () {
                        vm.pending = false;
                        vm.newIdea = newIdea();
                        vm.showSuccessMessage = true;
                        $timeout(function () {
                            vm.showSuccessMessage = false;
                        }, 1500);
                    }, function () {
                        vm.failed = true;
                        vm.pending = false;
                        vm.showSuccessMessage = false;
                    })
                }
            }
        };
    });