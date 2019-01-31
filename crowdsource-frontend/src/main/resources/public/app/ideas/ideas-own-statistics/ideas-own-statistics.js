angular.module('crowdsource')
    .directive('ideasOwnStatistics', function (Idea, IDEAS_STATUS) {

        return {
            templateUrl: 'app/ideas/ideas-own-statistics/ideas-own-statistics.html',
            controllerAs: 'vm',
            scope: {
                campaign: "=",
                ideas: "="
            },
            controller: function ($scope) {
                var vm = this;
                vm.proposedCount = 0;
                vm.rejectedCount = 0;
                vm.approvedCount = 0;

                vm.campaign = $scope.campaign;
                init();

                function registerDeriveStatsListener() {
                    var cleanupListener = $scope.$watch('ideas', function() {
                        deriveStats($scope.ideas);
                    });
                    $scope.$on('$destroy', function() { cleanupListener(); });
                }

                function init() {
                    registerDeriveStatsListener();
                    if (!$scope.ideas) { fetchOwnIdeas(); }
                }

                function fetchOwnIdeas() {
                    Idea.getOwnIdeas(vm.campaign.id).then(function (res) {
                        deriveStats(res)
                    });
                }

                function deriveStats(res) {
                    var ideas = res || [];
                    vm.proposedCount = ideas.filter(function (el) {
                        return el.status === IDEAS_STATUS.PROPOSED
                    }).length;
                    vm.rejectedCount = ideas.filter(function (el) {
                        return el.status === IDEAS_STATUS.REJECTED
                    }).length;
                    vm.approvedCount = ideas.filter(function (el) {
                        return el.status === IDEAS_STATUS.PUBLISHED
                    }).length;
                }
            }
        };
    });