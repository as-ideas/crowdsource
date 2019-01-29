angular.module('crowdsource')

    .constant('IDEAS_STATUS', {
        PROPOSED: 'PROPOSED',
        REJECTED: 'REJECTED',
        PUBLISHED: 'PUBLISHED'
    })
    .factory('Idea', function ($resource) {

        var service = {};

        var ideasCampaignResource = $resource('/ideas_campaigns', {}, {
            get: {
                isArray: true,
                method: 'GET'
            }
        });
        var ideaCampaignResource = $resource('/ideas_campaigns/:id', {});

        var ideasResource = $resource('/ideas_campaigns/:campaignId/ideas?status=:status', {}, {
            post: {
                method: 'POST'
            }
        });

        var ownIdeasResource = $resource('/ideas_campaigns/:campaignId/my_ideas', {}, {
            get: {
                isArray: true,
                method: 'GET'
            }
        });

        var ideaActionResource = $resource('/ideas_campaign/:campaignId/ideas/:ideasId/:action', {}, {
            put: {
                method: 'PUT'
            }
        });

        function getCampaigns() {
            return ideasCampaignResource.get().$promise;
        }

        function getCampaign(id) {
            return ideaCampaignResource.get({id: id}).$promise;
        }

        function createIdea(campaignId, idea) {
            return ideasResource.post({campaignId: campaignId}, idea).$promise;
        }

        function getOwnIdeas(campaignId) {
            return ownIdeasResource.get({campaignId: campaignId}).$promise;
        }

        function getIdeasWithStatus(campaignId, status) {
            return ideasResource.get({campaignId: campaignId, status: status}).$promise;
        }

        function getAll(campaignId) {
            return ideasResource.get({campaignId: campaignId}).$promise;
        }

        function rejectIdea(campaignId, ideaId, message) {
            return ideaActionResource.put({campaignId: campaignId, ideaId: ideaId, action: 'rejection'}, {
                rejectionComment: message
            }).$promise;
        }

        function publishIdea(campaignId, ideaId) {
            return ideaActionResource.put({campaignId: campaignId, ideaId: ideaId, action: 'approval'}).$promise;
        }

        service.getAll = getAll;
        service.getCampaigns = getCampaigns;
        service.getCampaign = getCampaign;
        service.getOwnIdeas = getOwnIdeas;
        service.createIdea = createIdea;
        service.getIdeasWithStatus = getIdeasWithStatus;

        service.rejectIdea = rejectIdea;
        service.publishIdea = publishIdea;

        return service;
    });
