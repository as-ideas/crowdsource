angular.module('crowdsource')

    .factory('Project', function ($resource, FinancingRound, $q) {

        var service = {};

        var projectResource = $resource('/project/:id', {}, {
            update: {
                method: 'PUT'
            }
        });
        var projectsResource = $resource('/projects');
        var projectPledgeResource = $resource('/project/:id/pledges');
        var projectStatusResource = $resource('/project/:id/status', {}, {
            patch: {
                method: 'PATCH'
            }
        });
        var projectAttachmentsResource = $resource('/projects/:id/attachments/:fileId', {}, {
            delete: {
                method: 'DELETE'
            }
        });

        var projectLikeResource = $resource('/projects/:id/likes', {}, {
            post: {
                method: 'POST'
            },
            delete: {
                method: 'DELETE'
            }
        });

        service.add = function (project) {
            return projectResource.save(project).$promise;
        };

        service.getAll = function () {
            return projectsResource.query();
        };

        service.get = function (projectId) {
            return projectResource.get({id: projectId}).$promise;
        };

        service.edit = function (project) {
            return projectResource.update({id: project.id}, project).$promise;
        };

        service.pledge = function (projectId, pledge) {
            return projectPledgeResource.save({id: projectId}, pledge);
        };

        service.publish = function (projectId) {
            return projectStatusResource.patch({id: projectId}, {status: 'PUBLISHED'});
        };

        service.reject = function (projectId) {
            return projectStatusResource.patch({id: projectId}, {status: 'REJECTED'});
        };

        service.publishAndDefer = function (projectId) {
            return projectStatusResource.patch({id: projectId}, {status: 'PUBLISHED_DEFERRED'});
        };

        service.defer = function (projectId) {
            return projectStatusResource.patch({id: projectId}, {status: 'DEFERRED'} );
        };

        service.deleteProjectAttachment = function (projectId, fileId) {
            return projectAttachmentsResource.delete({id: projectId, fileId: fileId}, {}).$promise;
        };

        service.isCreator = function (project, user) {
            return project.creator != undefined &&
                project.creator.email === user.email;
        };

        service.like = function (projectId) {
            return projectLikeResource.post({id: projectId}, {}).$promise;
        };

        service.unlike = function (projectId) {
            return projectLikeResource.delete({id: projectId}, {}).$promise;
        };

        service.userEligibleToEdit = function (project, user) {
            return user.hasRole("ADMIN") || service.isCreator(project, user);
        };

        service.isEditable = function (project) {
            var financingRoundActive = (FinancingRound.currentFinancingRound() == undefined
            || FinancingRound.currentFinancingRound().active);
            switch (project.status) {
                case 'FULLY_PLEDGED':
                    return false;
                case 'PROPOSED':
                case 'DEFERRED':
                case 'PUBLISHED_DEFERRED':
                    return true;
                case 'PUBLISHED':
                    return !financingRoundActive;
                default:
                    return false;
            }
        };

        service.getCampaigns = function() {
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        };

        return service;
    });