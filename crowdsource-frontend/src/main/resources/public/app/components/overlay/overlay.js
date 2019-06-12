angular.module('crowdsource')
    .constant('OVERLAY_ANIMATION_DURATION', 1500)
    .directive('overlay', function ($rootScope, $timeout, $compile, OVERLAY_ANIMATION_DURATION) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attr) {
                var overlayElement = null;
                var eventName = attr['overlay'] || '';

                addWrapperClass();
                registerEventListener();
                addOverlayElement();

                function addWrapperClass() {
                    if (!element.hasClass('overlay__wrapper')) {
                        element.addClass('overlay__wrapper');
                    }
                }

                function registerEventListener() {
                    var listener = $rootScope.$on(eventName, showOverlay);
                    scope.$on('$destroy', listener);
                }

                function addOverlayElement() {
                    overlayElement = angular.element(
                        $compile(
                            '<div class="overlay__container overlay--hidden {{type == \'failure\' ? \'overlay--failure\' : \'overlay--success\'}}"> ' +
                                '<div class="overlay__content">' +
                                    '<div class="overlay__icon"></div>' +
                                    '<div class="{{type == \'failure\' ? \'overlay__text--failure\' : \'overlay__text--success\'}}" ng-bind-html="message"></div>' +
                                '</div>' +
                            '</div>')(scope)
                    );
                    element.children().append(overlayElement);
                }

                function showOverlay(event, args) {
                    scope.message = args.message;
                    scope.type = args.type;

                    overlayElement.addClass('overlay--active');
                    $timeout(function () {
                        overlayElement.removeClass('overlay--active');
                        scope.message = '';
                        scope.type = '';
                    }, OVERLAY_ANIMATION_DURATION);
                }
            }
        }
    });