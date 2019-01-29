angular.module('crowdsource')

    .constant('IDEAS_STATUS', {
        PROPOSED: 'PROPOSED',
        REJECTED: 'REJECTED',
        PUBLISHED: 'PUBLISHED'
    })
    .factory('Idea', function ($resource, IDEAS_STATUS) {

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

        service.getAll = getAll;
        service.getCampaigns = getCampaigns;
        service.getCampaign = getCampaign;
        service.getOwnIdeas = getOwnIdeas;
        service.createIdea = createIdea;
        service.getIdeasWithStatus = getIdeasWithStatus;

        return service;
    });
