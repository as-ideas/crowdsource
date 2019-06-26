angular.module('crowdsource')
    .directive('ideaTeaser', function () {
        return {
            restrict: 'E',
            controllerAs: 'vm',
            scope: {
                'campaign': "="
            },
            templateUrl: 'app/ideas/idea-teaser/idea-teaser.html',
            controller: function ($scope, $rootScope, $translate, $sce) {

                $rootScope.$on('$translateChangeSuccess', function (event,data) {
                  vm.currentLanguage = data.language;
                  decodeDescriptionHTML();
                });

                var vm = this;
                vm.currentLanguage = $translate.use();

                if($scope.campaign.videoImageReference === null) $scope.campaign.videoImageReference = "/images/fallbacks/campaign-video-image-fallback.png";
                decodeDescriptionHTML();

                // Allow HTML with description, for example for </br> or <b>bold</b>
                function decodeDescriptionHTML() {
                    var decodedText = he.decode($scope.campaign.contentI18n[vm.currentLanguage].description);
                    $scope.trustedDescriptionHtml = $sce.trustAsHtml(decodedText);
                }
            }
        };
    });