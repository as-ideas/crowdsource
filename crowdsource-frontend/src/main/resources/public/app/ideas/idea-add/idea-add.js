angular.module('crowdsource')
    .directive('ideaAdd', function (Idea) {

        return {
            templateUrl: 'app/ideas/idea-add/idea-add.html',
            controllerAs: 'vm',
            scope: {
                campaign: "=",
                successFn: "="
            },
            controller: function ($scope) {
                var vm = this;
                vm.pending = false;
                vm.newIdea = {title: '', pitch: ''};
                vm.successFn = $scope.successFn;

                vm.campaign = $scope.campaign;
                if (!vm.campaign) {
                    throw Error('idea-add: missing campaign on scope in directive');
                }

                resetNewIdea();
                vm.send = saveIdea;

                function resetNewIdea() {
                    vm.newIdea.pitch = "";
                    vm.newIdea.title =  "";
                }

                function callSuccessFn(res) {
                    if (typeof vm.successFn === "function") {
                        vm.successFn(res);
                    }
                }

                function saveIdea() {
                    if (vm.pending) return;

                    vm.pending = true;

                    Idea.createIdea(vm.campaign.id, vm.newIdea).then(function (res) {
                        resetNewIdea();
                        callSuccessFn(res);
                    }).finally(function () {
                        vm.pending = false;
                    })
                }
            }
        };
    });