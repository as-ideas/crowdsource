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
            template: '<div class="loadMore__container"><a ng-click="vm.loadMore()" class=" loadMore__button teaser__btn">' +
                '<span class="loadMore__label">{{vm.loadingEnabled ? vm.loadMoreText : vm.noMoreText}}</span>' +
            '</a></div>',
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
