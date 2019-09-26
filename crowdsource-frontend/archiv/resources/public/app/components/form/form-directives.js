angular.module('crowdsource')

    .factory('ValidationUtils', function () {

        var shouldShowValidationError = function (form, fieldName) {
            if (!form[fieldName]) {
                return false;
            }

            var userInteracted = form.$submitted || form[fieldName].$dirty;
            return (userInteracted && form[fieldName].$invalid);
        };

        return {
            onShowError: function (elem, scope, form, fieldName, action) {
                scope.$watch(function () {
                    var showError = shouldShowValidationError(form, fieldName);
                    action(showError);
                });
            }
        };
    })

    .directive('formGroup', function (ValidationUtils) {
        return {
            require: '^form',
            restrict: 'A',
            link: function (scope, elem, attrs, form) {

                ValidationUtils.onShowError(elem, scope, form, attrs.formGroup, function (showError) {
                    elem.toggleClass('error', showError);
                });
            }
        };
    })

    .directive('formLabelValid', function (ValidationUtils) {
        return {
            require: '^form',
            restrict: 'A',
            link: function (scope, elem, attrs, form) {

                elem.addClass('valid-label');
                ValidationUtils.onShowError(elem, scope, form, attrs.formLabelValid, function (showError) {
                    elem.toggleClass('ng-hide', showError);
                });
            }
        }
    })

    .directive('formLabelInvalid', function (ValidationUtils) {
        return {
            require: '^form',
            restrict: 'A',
            link: function (scope, elem, attrs, form) {

                elem.addClass('invalid-label');
                ValidationUtils.onShowError(elem, scope, form, attrs.formLabelInvalid, function (showError) {
                    elem.toggleClass('ng-hide', !showError);
                });
            }
        }
    });