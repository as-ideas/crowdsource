angular.module('crowdsource')

    .factory('RemoteFormValidation', function () {
        // server error reason prefix
        var REMOTE_RULE_PREFIX = 'remote_';

        var applyGeneralError = function ($scope, errorCode) {
            $scope.generalErrors = {};
            $scope.generalErrors[REMOTE_RULE_PREFIX + errorCode] = true;
            return true;
        };

        var applyFieldErrors = function (form, fieldViolations) {
            var appliedErrors = false;

            angular.forEach(fieldViolations, function (rule, field) {
                if (form[field]) {
                    form[field].$setValidity(REMOTE_RULE_PREFIX + rule, false);
                    appliedErrors = true;
                }
            });

            return appliedErrors;
        };

        return {
            /**
             * The server response is expected to be
             * {
             *   "fieldViolations":
             *   {
             *     "email": "inactivated",
             *     "name": "unique",
             *     ...
             *   }
             * }
             *
             * For every key-value pair in "fieldViolations", the
             * validity of the form field is set to false:
             *
             *   form.email.$setValidity("inactivated", false);
             *   form.name.$setValidity("unique", false);
             *
             * Alternatively, the server response can be
             * {
             *   "message": "already_activated"
             * }
             *
             * In this case, the generalErrors is filled like so:
             * {
             *   "generalErrors": { already_activated: true }
             * }
             *
             * @param $scope The scope to apply the generalErrors to
             * @param form The form to apply the field validities to
             * @param response The server's response
             */
            applyServerErrorResponse: function ($scope, form, response) {
                var appliedErrors = false;

                $scope.generalErrors = null;

                if (response.status == 404) {
                    appliedErrors = applyGeneralError($scope, 'not_found');
                }
                else if (response.status == 400 && response.data && response.data.errorCode) {
                    if (response.data.errorCode == "field_errors" && response.data.fieldViolations) {
                        appliedErrors = applyFieldErrors(form, response.data.fieldViolations);
                    }
                    else {
                        appliedErrors = applyGeneralError($scope, response.data.errorCode);
                    }
                }

                if (!appliedErrors) {
                    applyGeneralError($scope, 'unknown');
                }
            },
            setGeneralError: applyGeneralError,
            clearRemoteErrors: function ($scope) {
                // fieldViolations will be cleared from the resetRemoteValidation directive
                $scope.generalErrors = null;
            },
            isRemoteRule: function (rule) {
                return rule.indexOf(REMOTE_RULE_PREFIX) === 0;
            }
        };
    })

    .directive('resetRemoteValidation', function (RemoteFormValidation) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {

                scope.$watch(attrs.ngModel, function () {
                    // iterate over ever error of the field
                    angular.forEach(ngModel.$error, function (valid, rule) {
                        if (RemoteFormValidation.isRemoteRule(rule)) {
                            // set the validity to true if it is a remote validation error when the value changes
                            ngModel.$setValidity(rule, true);
                        }
                    });
                });
            }
        }
    });