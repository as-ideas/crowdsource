angular.module('crowdsource')
    .controller('IdeasAdminController', function (campaign, Idea, IDEAS_STATUS) {
        var vm = this;
        vm.campaign = campaign;
        vm.pendingIdeas = [];
        vm.pendingIdeasTotal = 0;
        vm.rejectedIdeas = [];
        vm.rejectedIdeasTotal = 0;

        vm.reloadLists = reloadLists;

        init();

        function init() {
           fetchPendingIdeas();
           fetchRejectedIdeas();
        }

        function reloadLists() {
            fetchPendingIdeas();
            fetchRejectedIdeas();
        }

        function fetchRejectedIdeas() {
            Idea.getIdeasWithStatus(campaign.id, IDEAS_STATUS.REJECTED).then(function(res) {
                vm.rejectedIdeas = res.content;
                vm.rejectedIdeasTotal = res.totalElements;
            })
        }

        function fetchPendingIdeas() {
            Idea.getIdeasWithStatus(campaign.id, IDEAS_STATUS.PROPOSED).then(function(res) {
                vm.pendingIdeas = res.content;
                vm.pendingIdeasTotal = res.totalElements;
            });
        }

    });
