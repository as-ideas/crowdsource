angular.module('crowdsource')

/**
 * A form group (label + input field) for the crowdsource email input where the user
 * only has to enter the local part of the email address
 *
 * Label
 * +----------------+------------------+
 * |        foo.bar | @axelspringer.de |
 * +----------------+------------------+
 */
    .directive('emailFormGroup', function () {
        return {
            restrict: 'E',
            require: '^form',
            scope: {
                model: '=',
                fieldName: '@'
            },
            templateUrl: 'app/components/form/form-group/email/email-form-group.html',
            link: function (scope, element, attributes, form) {
                scope.form = form;
                scope.EMAIL_DOMAIN = "lala.de";
            }
        };
    })



/**
 * Custom validator that does not allow the local email part to contain "_extern"
 */
    .directive('nonExternalEmail', function (emailBlacklistPatterns) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.non_blacklisted_email = function (modelValue) {
                    if (!modelValue) {
                        return true;
                    }

                    for (var i = 0; i < emailBlacklistPatterns.length; i++) {
                        if (modelValue.indexOf(emailBlacklistPatterns[i]) >= 0) {
                            return false;
                        }
                    }

                    return true;
                }
            }
        };
    });