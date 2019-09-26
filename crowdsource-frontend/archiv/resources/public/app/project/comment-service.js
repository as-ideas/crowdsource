angular.module('crowdsource')

    .factory('Comment', function ($resource) {

        var service = {};

        var commentsResource = $resource('/project/:id/comments');
        var commentResource = $resource('/project/:id/comment');

        service.add = function (projectId, comment) {
            return commentResource.save({id: projectId}, comment);
        };

        service.getAll = function (projectId) {
            return commentsResource.query({id: projectId});
        };

        return service;
    });