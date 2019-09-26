angular.module('crowdsource')

    .factory('Foundation', function ($timeout) {
        var service = {};

        service.reflow = function (componentType) {
            // angular may not have fully completed it's digest cycle
            // -> delay the reflow for the next javascript cycle
            $timeout(function () {
                if (componentType) {
                    // only reflow certain foundation element types, e.g. 'tooltip'
                    $(document).foundation(componentType, 'reflow');
                }
                else {
                    $(document).foundation('reflow');
                }
            });
        };

        return service;
    })

/**
 * Used to call foundation's reflow function which re-scans the DOM for foundation elements that need javascript to work.
 * This might be needed when elements were rendered into the DOM at a later point (e.g. when changing views).
 *
 * If the directive is used on an element without an attribute value, e.g. <div foundation-reflow></div>,
 * then $(document).foundation('reflow') is called. This scans the DOM for all kind of foundation widgets.
 *
 * If the directive is used with an attribute value, e.g. <div foundation-reflow="tooltip">,
 * then $(document).foundation('tooltip', 'reflow') is called. This scans the DOM only for tooltip widgets in this example.
 * This reduces computation time.
 */
    .directive('foundationReflow', function (Foundation) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var componentType = attrs.foundationReflow;

                if (attrs.ngRepeat) {
                    // if this directive was applied on an ng-repeat element, reflow only after ng-repeat is done
                    if (scope.$last) {
                        Foundation.reflow(componentType);
                    }
                }
                else {
                    Foundation.reflow(componentType);
                }
            }
        }
    });
