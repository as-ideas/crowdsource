angular.module('crowdsource')

    .controller('IdeasOwnController', function (campaign, Idea, IDEAS_STATUS) {
        var vm = this;
        vm.published = [];
        vm.proposed = [];
        vm.rejected = [];
        vm.ideas = [];

        vm.campaign = campaign;
        vm.refreshList = refreshList;

        init();

        function init() {
            fetchIdeas();
        }

        function fetchIdeas() {
            Idea.getOwnIdeas(campaign.id).then(function (res) {
                vm.ideas = res || [];
                vm.published = vm.ideas.filter(function (el) {
                    return el.status === IDEAS_STATUS.PUBLISHED
                });
                vm.proposed = vm.ideas.filter(function (el) {
                    return el.status === IDEAS_STATUS.PROPOSED
                });
                vm.rejected = vm.ideas.filter(function (el) {
                    return el.status === IDEAS_STATUS.REJECTED
                });
                console.log(vm.proposed);
            });
        }

        function refreshList() {
            fetchIdeas();
        }
    });
