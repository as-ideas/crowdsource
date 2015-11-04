angular.module('crowdsource')

    .factory('RangeSliderService', function () {
        var service = {};

        // this is the max value of the slider. Do not choose a too low value, or the slider movement will not be fluent
        service.sliderMaxValue = 10000;

        service.calcRealValue = function (sliderValue, start, end) {
            return Math.round((start + sliderValue * (end - start)) / service.sliderMaxValue);
        };

        service.calcSliderValue = function (realValue, start, end) {
            return Math.round((realValue - start) / (end - start) * service.sliderMaxValue);
        };

        return service;
    })

    .directive('rangeSlider', function (RangeSliderService) {
        return {
            scope: {
                start: '@',
                end: '@',
                disabled: '=',
                pledge: '='
            },
            template: '<div class="range-slider" data-slider="0" data-current-real="{{ initialRealValue }}" data-options="start: 0; end: {{ sliderMax }}" ng-class="{ disabled: disabled }" foundation-reflow="slider">' +
            '<span class="range-slider-handle" role="slider" tabindex="0"></span>' +
            '<span class="range-slider-active-segment"></span>' +
            '</div>',
            link: function (scope, element, attributes) {
                // The foundation slider is fixed to 0 <-> RangeSliderService.sliderMaxValue and the real value is computed with the help of the start and end directive attributes.
                // The reason is, that foundation cannot handle the change of start and or end values properly after the slider was initialized
                scope.sliderMax = RangeSliderService.sliderMaxValue;
                scope.initialRealValue = scope.pledge.amount;

                var slider = element.find('[data-slider]');

                scope.$watch('pledge.amount', function () {
                    // Prevent rerender if invalid data provided.
                    if (typeof scope.pledge.amount !== 'undefined') {
                        var newSliderValue = RangeSliderService.calcSliderValue(scope.pledge.amount, parseInt(scope.start), parseInt(scope.end)),
                            oldSliderValue = slider.data('slider');
                        if (typeof newSliderValue === "number" && isFinite(newSliderValue) && newSliderValue !== oldSliderValue) {
                            // re-render the slider when start or end changes
                            render(newSliderValue);
                        }
                    }
                });

                function render (sliderValue) {
                    slider.foundation('slider', 'set_value', sliderValue);
                    // http://www.bradleyhamilton.com/blog/foundation-range-slider-callback-not-firing-after-setting-the-data-slider-value-dynamically
                    registerChangeListener();
                }

                function registerChangeListener() {
                    slider.on('change.fndtn.slider', function () {
                        var sliderValue = slider.attr('data-slider');

                        var realValue = RangeSliderService.calcRealValue(parseInt(sliderValue), parseInt(scope.start), parseInt(scope.end));

                        scope.pledge.amount = realValue;
                    });
                }

                if (scope.initialRealValue === 0) {
                    registerChangeListener();
                }
            }
        };
    });