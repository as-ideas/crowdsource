angular.module('crowdsource')
    .directive('ideaTeaser', function () {
        return {
            restrict: 'E',
            controllerAs: 'vm',
            scope: {
                'campaign': "="
            },
            templateUrl: 'app/ideas/idea-teaser/idea-teaser.html',
            controller: function ($scope) {
                var vm = this;
                vm.campaign = angular.copy($scope.campaign);
                formatDateString(vm.campaign)
                if(vm.campaign.videoImageReference === null) vm.campaign.videoImageReference = "/images/fallbacks/campaign-video-image-fallback.png";

                function formatDateString(campaign) {
                    startDate = new Date(campaign.startDate);
                    endDate = new Date(campaign.endDate);

                    campaign.startDateString = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear();
                    campaign.endDateString = endDate.getDate() + "." + (endDate.getMonth()+1) + "." + endDate.getFullYear();
                }
            }
        };
    });