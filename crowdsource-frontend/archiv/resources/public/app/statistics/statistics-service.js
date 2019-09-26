angular.module('crowdsource')

    .factory('Statistics', function ($resource) {
        var service = {};

        service.getCurrentStatistics = function (data) {
            return $resource("/statistics/current").query(data).$promise;
        };

        service.getProjectsPerStatus = function () {
            return $resource("/statistics/projects_per_status").query().$promise;
        };

        service.getCommentCountPerProject = function (data) {
            return $resource("/statistics/comment_count_per_project").query(data).$promise;
        };

        service.getSumComments = function (data) {
            return $resource("/statistics/comments/sum").query(data).$promise;
        };

        return service;
    });