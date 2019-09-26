angular.module('crowdsource')
    .directive('loadMore', function () {

        return {
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                paging: '=',
                disableLoading: '=',
                loadFn: '=',
                'loadMoreLabel': '=',
                'noMoreLabel': '='
            },
            templateUrl: 'app/components/load-more/load-more.html',
            controller: function () {
                var vm = this;
                vm.paging = this.paging;
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
