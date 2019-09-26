angular.module('crowdsource')

    .directive('datepicker', function () {

        var CONST = {
            DATE_TIME_SELECTION_RANGE: {
                FROM_TODAY: "fromToday",
                UNTIL_TODAY: "untilToday",
                FUTURE: "future",
                PAST: "past"
            }
        };

        return {
            require: 'ngModel',

            link: function (scope, elem, attrs, ngModel) {

                var timerange = attrs.timerange;

                $(elem).fdatepicker({
                    format: "dd.mm.yyyy",

                    onRender: function (date) {
                        if (timerange === CONST.DATE_TIME_SELECTION_RANGE.FROM_TODAY) {
                            //allow only dates starting from today
                            var nowTemp = new Date();
                            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
                            return date.valueOf() < now.valueOf() ? 'disabled' : '';
                        } else if (timerange === CONST.DATE_TIME_SELECTION_RANGE.UNTIL_TODAY) {
                            //allow only dates until today
                            var nowTemp = new Date();
                            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate() + 1, 0, 0, 0, 0);
                            return date.valueOf() > now.valueOf() ? 'disabled' : '';
                        } else if (timerange === CONST.DATE_TIME_SELECTION_RANGE.PAST) {
                            //allow only dates until today exclusive
                            var nowTemp = new Date();
                            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
                            return date.valueOf() > now.valueOf() ? 'disabled' : '';
                        } else if (timerange === CONST.DATE_TIME_SELECTION_RANGE.FUTURE) {
                            //allow only dates starting from tomorrow
                            var nowTemp = new Date();
                            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate() + 1, 0, 0, 0, 0);
                            return date.valueOf() < now.valueOf() ? 'disabled' : '';
                        }
                    }
                });

                ngModel.$parsers.push(function (stringValue) {
                    if (stringValue) {

                        var date = moment(stringValue, "DD.MM.YYYY");
                        date = date.tz('Europe/Berlin');

                        date.hour(23);
                        date.minute(59);
                        date.second(59);

                        return date.toDate();
                    }
                    return null;
                });
                ngModel.$formatters.push(function (date) {
                    if (date) {
                        return '' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
                    }
                    return '';
                });
            }
        }
    });