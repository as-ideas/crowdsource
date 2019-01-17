angular.module('crowdsource')

    .directive('intro', function () {
        return {
            controllerAs: 'intro',
            bindToController: true,
            templateUrl: 'app/misc/team-member.html',
            scope: {
                image: '@',
                email: '@',
                name: '@',
                role: '@'
            },
            controller: function () {
                // no-op, do not remove this controller!
            }
        };
    });
