// Expose statistics constants

angular.module('crowdsource')
    .constant("STATISTICS_CONST", {
        TIME_PRECISION_TYPE: {
            DAY: {
                id: "DAY",
                label: "Tag",
                precision: 1
            }
            //,
            //WEEK: {
            //    id: "WEEK",
            //    label: "Woche",
            //    precision: 7
            //},
            //MONTH: {
            //    id: "MONTH",
            //    label: "Monat",
            //    precision: 30
            //}
        },
        PAGES: {
            NONE: {
                label: "-- Bitte auswählen --",
                name: "NONE"
            },
            CURRENT: {
                label: "Anzahl Neuregistrieung / Neu eingereichte Ideen",
                name: "CURRENT"
            },
            PROJECT_SUM_PER_STATUS: {
                label: "Projekte je Projektstatus",
                name: "PROJECT_SUM_PER_STATUS"
            },
            COMMENT_SUM_PER_PROJECT: {
                label: "Kommentare je Projekt",
                name: "COMMENT_SUM_PER_PROJECT"
            },
            COMMENT_SUM: {
                label: "Anzahl Kommentare",
                name: "COMMENT_SUM"
            }
        },
        COUNT: {
            THREE: {
                label: "Top Drei",
                value: 3
            },
            FIVE: {
                label: "Top Fünf",
                value: 5
            },
            TEN: {
                label: "Top Zehn",
                value: 10
            },

        }
    })
    .controller('StatisticsController', function (STATISTICS_CONST) {
        var vm = this;

        vm.data = {
            availablePageOptions: STATISTICS_CONST.PAGES,
            availableTimePrecisionTypeOptions: STATISTICS_CONST.TIME_PRECISION_TYPE,
            timePrecision: STATISTICS_CONST.TIME_PRECISION_TYPE.DAY,
            statisticType: STATISTICS_CONST.PAGES.NONE,
            availableProjectCount: STATISTICS_CONST.COUNT,
            projectCount: STATISTICS_CONST.COUNT.FIVE
        };
    });