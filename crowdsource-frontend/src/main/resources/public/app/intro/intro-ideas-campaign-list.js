angular.module('crowdsource')
    .directive('introIdeasCampaignList', function (Idea) {

        return {
            restrict: 'E',
            templateUrl: 'app/intro/intro-ideas-campaign-list.html',
            controllerAs: "list",
            scope: {},
            bindToController: true,
            controller: function () {
                var vm = this;
                vm.entries = [];

                var startDate;
                var endDate;

                console.log("ok")

                function formatDateString(entries) {
                    for(var i=0; i < entries.length; i++) {
                        console.log("yeah")

                        startDate = new Date(vm.entries[i].startDate);
                        endDate = new Date(vm.entries[i].endDate);

                        entries[i].startDateString = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear();
                        entries[i].endDateString = endDate.getDate() + "." + (endDate.getMonth()+1) + "." + endDate.getFullYear();

                        console.log(entries[i])
                    }
                }

                getIdeaCampaigns();

                function getIdeaCampaigns() {
                    Idea.getCampaigns().then(
                        function(response) {
                            vm.entries = response;
                            formatDateString(vm.entries)
                        },
                        function() {
                            vm.entries = []
                        }
                    );

                }
            }
        };
    });