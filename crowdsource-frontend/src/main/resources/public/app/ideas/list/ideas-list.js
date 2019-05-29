angular.module('crowdsource')
    .controller('IdeasListController', function (campaign, Authentication, Idea, $rootScope, $filter) {
        var $translate = $filter('translate');

        var FILTER_ALL = 'ALL';
        var FILTER_VOTED = 'VOTED';
        var FILTER_NOT_VOTED = 'NOT_VOTED';

        var vm = this;
        vm.auth = Authentication;
        vm.campaign = campaign;
        vm.ideas = [];
        vm.paging = {};
        vm.loadMore = loadMore;
        vm.selectedFilter = FILTER_ALL;
        vm.setFilter = setFilter;

        vm.filterState = {};

        init();

        function init() {
            loadMore(0);
        }

        vm.reloadOwnIdeas = function () {
            // TODO: Candidate to extract into an own eventing object, see: http://eburley.github.io/2013/01/31/angularjs-watch-pub-sub-best-practices.html
            $rootScope.$broadcast('UPDATE_OWN_STATISTICS', {}, {});
            $rootScope.$broadcast('ADD_IDEA_SUCCESS', { type: 'success', message: $translate('IDEA_ADD_MESSAGE_1') + '<br>' + $translate('IDEA_ADD_MESSAGE_2') });
        };

        function loadMore(page) {
            switch (vm.selectedFilter) {
                case FILTER_ALL: {
                    vm.selectedFilter = FILTER_ALL;
                    loadAll(page);
                    break;
                }
                case FILTER_VOTED: {
                    vm.selectedFilter = FILTER_VOTED;
                    loadAlreadyVoted(true, page);
                    break;
                }
                case FILTER_NOT_VOTED: {
                    vm.selectedFilter = FILTER_NOT_VOTED;
                    loadAlreadyVoted(false, page);
                    break;
                }
            }
        }

        function loadAlreadyVoted(votedFlag, page) {
            Idea.getAlreadyVoted(campaign.id, votedFlag, page).then(function (res) {
                // console.log("RESOLVE_", res.content)
                vm.ideas = vm.ideas.concat(res.content);
                vm.paging = res;
            });
        }

        function loadAll(page) {
            Idea.getAll(campaign.id, page).then(function (res) {
                vm.ideas = vm.ideas.concat(res.content);
                vm.paging = res;
            });
        }

        function setFilter(filter) {
            vm.selectedFilter = filter;
            vm.ideas = [];
            vm.paging = {};
            loadMore(0);
        }


    });
