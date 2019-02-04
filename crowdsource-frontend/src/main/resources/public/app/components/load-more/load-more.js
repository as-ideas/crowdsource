angular.module('crowdsource')
    .directive('loadMore', function () {

        var loadMoreText = "Mehr Daten laden";
        var noMoreText = "Keine Daten mehr";

        return {
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                paging: '=',
                loadFn: '=',
                loadMoreLabel: '@',
                noMoreLabel: '@'
            },
            template: '<div class="loadMore__container"><button ng-click="vm.loadMore()" class="button-secondary">' +
                '{{vm.loadingEnabled ? vm.loadMoreText : vm.noMoreText}}' +
            '</button></div>',
            controller: function () {

                var vm = this;
                vm.loadMore = loadMore;
                vm.loadMoreText = vm.loadMoreLabel || loadMoreText;
                vm.noMoreText = vm.noMoreLabel|| noMoreText;
                vm.loadingEnabled = (vm.paging.number + 1) <= vm.paging.totalPages;

                function loadMore() {
                    if (vm.loadingEnabled) {
                        vm.loadFn(vm.paging.number + 1);
                    }
                }
            }
        }
    });
