angular.module('crowdsource')
    .controller('IdeasListController', function (campaign, Authentication, Idea, $rootScope) {
        var FILTER_ALL = 'ALL';
        var FILTER_VOTED = 'VOTED';
        var FILTER_NOT_VOTED = 'NOT_VOTED';
        var FILTER_STATES = [FILTER_ALL, FILTER_NOT_VOTED, FILTER_VOTED];

        var vm = this;
        vm.auth = Authentication;
        vm.campaign = campaign;
        vm.ideas = [];
        vm.paging = {};
        vm.loadMore = loadMore;
        vm.selectedFilter = FILTER_ALL;
        vm.setFilter = setFilter;

        init();

        function init() {
            loadMore(0);
        }

        vm.reloadOwnIdeas = function () {
            // TODO: Candidate to extract into an own eventing object, see: http://eburley.github.io/2013/01/31/angularjs-watch-pub-sub-best-practices.html
            $rootScope.$broadcast('UPDATE_OWN_STATISTICS', {}, {});
        };

        function loadMore(page) {

            Idea.getAll(campaign.id, page).then(function (res) {
                vm.ideas = vm.ideas.concat(res.content);
                vm.paging = res;
            });
        }

        function setFilter(filter) {
            switch (filter) {
                case FILTER_ALL: {
                    vm.selectedFilter = FILTER_ALL;
                    loadMore(0);
                    break;
                }
                case FILTER_VOTED: {
                    vm.selectedFilter = FILTER_VOTED;
                    loadAlreadyVoted(true);
                    break;
                }
                case FILTER_NOT_VOTED: {
                    vm.selectedFilter = FILTER_NOT_VOTED;
                    loadAlreadyVoted(false);
                    break;
                }
            }
        }

        function loadAlreadyVoted(votedFlag) {
            Ideas.getAlreadyVoted(campaign.id, votedFlag).then(function() {
                vm.ideas = vm.ideas.concat(res.content);
                vm.paging = res;
            });

        }
    });
