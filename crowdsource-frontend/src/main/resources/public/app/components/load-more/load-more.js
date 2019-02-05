angular.module('crowdsource')
    .directive('loadMore', function () {

        var loadMoreText = "Mehr Daten laden";
        var noMoreText = "Keine Daten mehr";

        return {
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                paging: '=',
                disableLoading: '=',
                loadFn: '=',
                loadMoreLabel: '@',
                noMoreLabel: '@'
            },
            template: '<div class="loadMore__container"><button ng-click="vm.loadMore()" class="button-secondary loadMore__button">' +
                '{{!vm.paging.last? vm.loadMoreText : vm.noMoreText}}' +
            '</button></div>',
            controller: function () {
                var vm = this;
                vm.paging = this.paging;
                vm.loadMoreText = vm.loadMoreLabel || loadMoreText;
                vm.noMoreText = vm.noMoreLabel|| noMoreText;
                vm.disableLoading = vm.paging && vm.paging.last;
                vm.loadMore = loadMore;

                function loadMore() {
                    if (!vm.paging.last) {
                        vm.loadFn(vm.paging.number + 1);
                    }
                }
            }
        }
    });
