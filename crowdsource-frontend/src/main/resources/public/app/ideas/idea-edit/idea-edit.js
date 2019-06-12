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

                // Loosely couple to controller that actually sends the idea to the backend
                // Set form to its pristine state after succesfully sumbit so another idea can be cleanly submitted (in partucular reset error labels to valid labels)
                $scope.$on('ADD_IDEA_SUCCESS', function(e) {
                    console.log("SUCCESS")
                    console.log($scope.ideaEditForm);

                    vm.idea.contentI18n.original.title = '';
                    vm.idea.contentI18n.original.pitch = '';
                    $scope.ideaEditForm.$setPristine();
                });

                if (!vm.idea) {
                    throw Error('idea-edit missing idea on scope in directive');
                }

                function submit() {
                    // Service endpoint requires flat IdeaIn object which has title and pitch instead of contentI18n
                    vm.idea.title = vm.idea.contentI18n.original.title;
                    vm.idea.pitch = vm.idea.contentI18n.original.pitch;
                    $scope.submitFn(vm.idea);
                };

                function cancel () {
                    // Service endpoint requires flat IdeaIn object which has title and pitch instead of contentI18n
                    vm.idea.title = vm.idea.contentI18n.original.title;
                    vm.idea.pitch = vm.idea.contentI18n.original.pitch;
                    $scope.cancelFn();
                };
            }
        };
    });