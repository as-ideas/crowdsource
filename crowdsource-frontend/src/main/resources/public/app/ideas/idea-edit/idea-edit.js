angular.module('crowdsource')
    .directive('ideaEdit', function () {

        return {
            templateUrl: 'app/ideas/idea-edit/idea-edit.html',
            controllerAs: 'vm',
            scope: {
                campaign: "=",
                idea: "=",
                submitFn: "=",
                cancelFn: "="
            },
            controller: function ($scope) {
                var vm = this;

                vm.idea = $scope.idea;
                vm.cancel = $scope.cancelFn ? cancel : null;
                vm.submit = $scope.submitFn ? submit : null;

                if (!vm.idea) {
                    throw Error('idea-edit missing idea on scope in directive');
                }

                var originalIdea = {
                    title: vm.idea.title,
                    pitch: vm.idea.pitch
                };

                function submit() {
                    $scope.submitFn(vm.idea);
                };

                function cancel () {
                    vm.idea.title = originalIdea.title;
                    vm.idea.pitch = originalIdea.pitch;
                    $scope.cancelFn();
                };
            }
        };
    });