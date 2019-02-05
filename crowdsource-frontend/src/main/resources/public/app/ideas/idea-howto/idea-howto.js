angular.module('crowdsource')
    .directive('ideaHowto', function () {
        return {
            restrict: 'E',
            scope: {
                'campaign': '='
            },
            templateUrl: 'app/ideas/idea-howto/idea-howto.html',
            controller: function () {
            }
        };
    });