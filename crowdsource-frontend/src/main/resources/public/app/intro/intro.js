angular.module('crowdsource')

    .directive('intro', function (Authentication) {
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
                const vm = this;
                vm.auth = Authentication;
            }
        };
    });
