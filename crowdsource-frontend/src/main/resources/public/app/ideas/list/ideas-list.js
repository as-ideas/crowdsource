angular.module('crowdsource')
    .controller('IdeasListController', function (campaign, Authentication, Idea) {
        var vm = this;
        vm.auth = Authentication;
        vm.campaign = campaign;
        vm.ideas = [];
        vm.paging = {};
        vm.loadMore = loadMore;

        init();

        function init(){
            loadMore(0);
        }

        function loadMore(page) {
            Idea.getAll(campaign.id).then(function(res) {
                vm.ideas = vm.ideas.concat(res.content);
                vm.paging = res;
                delete vm.paging.content;
            });
        }
    });
