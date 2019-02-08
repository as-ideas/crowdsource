angular.module('crowdsource')
    .directive('overlaySuccess', function ($rootScope, $timeout, $compile) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attr) {
                var overlayElement = null;
                var eventName = attr['overlaySuccess'] || '';

                addWrapperClass();
                registerEventListener();
                addOverlayElement();

                function addWrapperClass() {
                    if (!element.hasClass('overlaySuccess__wrapper')) {
                        element.addClass('overlaySuccess__wrapper');
                    }
                }

                function registerEventListener() {
                    var listener = $rootScope.$on(eventName, showOverlay);
                    scope.$on('$destroy', listener);
                }

                function addOverlayElement() {
                    overlayElement = angular.element(
                        $compile(
                            '<div class="overlaySuccess__container overlaySuccess--hidden">' +
                            '<div class="overlaySuccess__content">' +
                            '<div class="overlaySuccess__icon"></div>' +
                            '<div class="overlaySuccess__text">{{message}}</div>' +
                            '</div></div>')(scope)
                    );
                    element.children().append(overlayElement);
                }

                function showOverlay(event, args) {
                    console.log('showOverlay', args, element, element.children(':first'), overlayElement);
                    scope.message = args.message || '';

                    overlayElement.addClass('overlaySuccess--active');
                    $timeout(function () {
                        overlayElement.removeClass('overlaySuccess--active')
                    }, 1000)
                }
            }
        }
    });