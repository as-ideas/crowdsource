angular.module('crowdsource')

    .directive('footer', function (Authentication) {
        var directive = {};

        directive.controllerAs = 'footer';
        directive.bindToController = true;
        directive.templateUrl = 'app/components/layout/footer/footer.html';

        directive.controller = function () {
            var vm = this;
            vm.auth = Authentication;
        };

        return directive;
    });
