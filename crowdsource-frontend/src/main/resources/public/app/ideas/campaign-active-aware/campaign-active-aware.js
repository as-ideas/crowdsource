angular.module('crowdsource')
    .directive('campaignActiveAware', function () {

        function link(scope, element) {
            if(scope.campaign) {
               if(scope.campaign.active != null && !scope.campaign.active)
                element[0].disabled = true;
            }
        }

        return {
            link: link
        }
    });