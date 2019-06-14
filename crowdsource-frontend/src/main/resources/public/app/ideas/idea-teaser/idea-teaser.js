angular.module('crowdsource')
    .directive('ideaTeaser', function () {
        return {
            restrict: 'E',
            controllerAs: 'vm',
            scope: {
                'campaign': "="
            },
            templateUrl: 'app/ideas/idea-teaser/idea-teaser.html',
            controller: function ($scope, $rootScope, $translate) {

                $rootScope.$on('$translateChangeSuccess', function (event,data) {
                  vm.currentLanguage = data.language;
                });

                var vm = this;
              vm.currentLanguage = $translate.use();

                // vm.campaign = angular.copy($scope.campaign);
                if($scope.campaign.videoImageReference === null) $scope.campaign.videoImageReference = "/images/fallbacks/campaign-video-image-fallback.png";

                /*
                function formatDateString(campaign) {
                    startDate = new Date(campaign.startDate);
                    endDate = new Date(campaign.endDate);

                    campaign.startDateString = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear();
                    campaign.endDateString = endDate.getDate() + "." + (endDate.getMonth()+1) + "." + endDate.getFullYear();
                }
                */
            }
        };
    });