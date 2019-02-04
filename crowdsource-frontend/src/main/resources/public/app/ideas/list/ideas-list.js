angular.module('crowdsource')
    .controller('IdeasListController', function (campaign, Authentication, Idea, $rootScope) {
        var vm = this;
        vm.auth = Authentication;
        vm.campaign = campaign;
        vm.ideas = [];
        vm.paging = {};
        vm.loadMore = loadMore;

        init();

        function init(){
            loadMore();
        }

        vm.reloadOwnIdeas = function () {
            // TODO: Candidate to extract into an own eventing object, see: http://eburley.github.io/2013/01/31/angularjs-watch-pub-sub-best-practices.html
            $rootScope.$broadcast('UPDATE_OWN_STATISTICS', {},{});
        };

        function loadMore(page) {
            Idea.getAll(campaign.id, page).then(function(res) {
                vm.ideas = vm.ideas.concat(res.content);
                vm.paging = res;
            });
        }
    });
