angular.module('crowdsource')

/**
 * The foundation accordion implemented as an angular directive.
 * (The jQuery version of foundation uses anchors with hashes to open and close
 * the accordion items. This break angular's routing)
 */
    .directive('accordionItem', function () {
        return {
            transclude: true,
            controllerAs: 'accordion',
            bindToController: true,
            template: '<li class="accordion-navigation" ng-class="{ \'accordion-active\': accordion.showContent }">' +
            '<a ng-click="accordion.showContent = !accordion.showContent" >{{ accordion.title }}</a>' +
            '<div class="content" ng-transclude ng-if="accordion.showContent"></div>' +
            '</li>',
            scope: {
                title: '@',
            },
            controller: function () {
                // no-op, do not remove!
            }
        };
    });
