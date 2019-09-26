angular.module('crowdsource')
    .directive('statisticsForm', function () {
        var CONST = {
            "DEFAULT_FROM_DAYS": 14
        }, prepareDataForLineChart = function (vm) {
            vm.data.chart.renderBar = false;
            vm.data.chart.renderLine = true;

            vm.data.statisticsResponse.forEach(function (seriesEntry) {
                var data = [];
                var labels = [];

                vm.data.chart.series.push(seriesEntry.name);

                seriesEntry.data.forEach(function (dataEntry) {
                    labels.push(dataEntry.label);
                    data.push(dataEntry.data);
                });

                vm.data.chart.data.push(data);

                // NOTE: labels is set twice
                vm.data.chart.labels = labels;
            });
        }, prepareDataForBarChart = function (vm) {
            vm.data.chart.renderBar = true;
            vm.data.chart.renderLine = false;

            vm.data.statisticsResponse.forEach(function(entry) {
                vm.data.chart.data.push(entry.count);
                vm.data.chart.labels.push(entry.name);
            });
        }, initChartData = function (vm) {
            vm.data.chart.data = [];
            vm.data.chart.labels = [];
            vm.data.chart.series = [];
        }, sanitizeStartDate = function (vm) {
            var now = new Date();
            return vm.data.startDate || new Date(now.getFullYear(), now.getMonth(), now.getDate() - CONST.DEFAULT_FROM_DAYS)
        }, sanitizeEndDate = function (vm) {
            var now = new Date();
            return vm.data.endDate || now;
        }, RESPONSE_HANDLERS = {
            currentStatisticsResponseHandler : function (vm, response) {
                vm.data.statisticsResponse = response;
                initChartData(vm);
                prepareDataForLineChart(vm);
            },
            projectsPerStatusResponseHandler : function (vm, response) {
                vm.data.statisticsResponse = response;
                initChartData(vm);
                prepareDataForBarChart(vm);
            },
            commentsPerProjectResponseHandler : function (vm, response) {
                vm.data.statisticsResponse = response;
                initChartData(vm);
                prepareDataForBarChart(vm);
            },
            sumCommentsResponseHandler : function (vm, response) {
                vm.data.statisticsResponse = response;
                initChartData(vm);
                prepareDataForLineChart(vm);
            },
            defaultErrorHandler : function (vm) {
                vm.data.info = "Ooooops! Da ist etwas schief gelaufen!";
            }
        };

        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: 'app/components/statistics/statistics-form.html',
            controller: function ($scope, Statistics, STATISTICS_CONST) {
                var vm = $scope;

                vm.STATISTICS_CONST = STATISTICS_CONST;
                vm.data.chart = {};

                vm.statisticTypeChanged = function () {
                    if (vm.data.statisticType.name === STATISTICS_CONST.PAGES.CURRENT.name) {
                        vm.data.startDate = sanitizeStartDate(vm);
                        vm.data.endDate = sanitizeEndDate(vm);

                        Statistics.getCurrentStatistics({startDate: vm.data.startDate, endDate: vm.data.endDate}).then (
                            function (response) {RESPONSE_HANDLERS.currentStatisticsResponseHandler(vm, response)},
                            function () {RESPONSE_HANDLERS.defaultErrorHandler(vm);}
                        );
                    } else if (vm.data.statisticType.name === STATISTICS_CONST.PAGES.PROJECT_SUM_PER_STATUS.name) {
                        Statistics.getProjectsPerStatus().then(
                            function (response) {RESPONSE_HANDLERS.projectsPerStatusResponseHandler(vm, response)},
                            function () {RESPONSE_HANDLERS.defaultErrorHandler(vm);}
                        );
                    } else if (vm.data.statisticType.name === STATISTICS_CONST.PAGES.COMMENT_SUM_PER_PROJECT.name) {
                        Statistics.getCommentCountPerProject({projectCount: vm.data.projectCount.value}).then(
                            function (response) {RESPONSE_HANDLERS.commentsPerProjectResponseHandler(vm, response)},
                            function () {RESPONSE_HANDLERS.defaultErrorHandler(vm);}
                        );
                    } else if (vm.data.statisticType.name === STATISTICS_CONST.PAGES.COMMENT_SUM.name) {
                        vm.data.startDate = sanitizeStartDate(vm);
                        vm.data.endDate = sanitizeEndDate(vm);

                        Statistics.getSumComments({startDate: vm.data.startDate, endDate: vm.data.endDate}).then(
                            function (response) {RESPONSE_HANDLERS.sumCommentsResponseHandler(vm, response)},
                            function () {RESPONSE_HANDLERS.defaultErrorHandler(vm);}
                        );
                    }
                };

                vm.dateChanged = function () {
                    vm.statisticTypeChanged();
                };

                vm.clearInfo = function () {
                    vm.data.info = undefined;
                };

                vm.statisticTimePrecisionChangeHandler = function () {
                    prepareDataForLineChart(vm);
                };

                vm.shouldShowDatePickerWithPrecision = function () {
                    return vm.data.statisticType !== undefined
                        && (STATISTICS_CONST.PAGES.CURRENT.name === vm.data.statisticType.name
                        || STATISTICS_CONST.PAGES.COMMENT_SUM.name === vm.data.statisticType.name);
                };

                vm.shouldShowCountPicker = function () {
                    return vm.data.projectCount !== undefined
                        && STATISTICS_CONST.PAGES.COMMENT_SUM_PER_PROJECT.name === vm.data.statisticType.name;
                };

                vm.statisticsProjectCountChangeHandler = function () {
                    vm.statisticTypeChanged(vm);
                }
            }
        };
    });