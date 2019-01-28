angular.module('crowdsource')

    .factory('Idea', function ($resource) {

        var service = {};

        var ideasCampaignResource = $resource('/ideas_campaigns', {}, {
            get: {
                isArray: true,
                method: 'GET'
            }
        });
        var ideaCampaignResource = $resource('/ideas_campaigns/:id', {});

        var ideasResource = $resource('/ideas_campaigns/:campaignId/ideas', {}, {
            post: {
                method: 'POST'
            }
        });

        var ownIdeasResource = $resource('/ideas_campaigns/:campaignId/own_ideas', {}, {
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

        function getOwnIdeas() {
            return ownIdeasResource.get({campaignId: campaignId}).$promise;
        }

        function getAll() {

            return [{
                firstName: 'Peter',
                lastName: 'Pan',
                email: 'peter@demo',
                text: 'Meine Idee in genau 255 Zeichen zu beschreiben, ist die Aufgabe dieses Textes um dann auch zu sehen wir das vom Layout dann passt denn soviele Zeichen sind gar nicht so wenig und man muss ja auch die Breite jedes Buchstaben berücksichtigen zumindest grob.',
                votes: 1,
                avgVotes: '4.0',
                status: 'published'
            }, {
                firstName: 'Peter',
                lastName: 'Pan',
                email: 'peter@demo',
                text: 'this idea sis m',
                votes: 22,
                avgVotes: '1.0',
                status: 'published'
            }, {
                firstName: 'Peter',
                lastName: 'Pan',
                email: 'peter@demo',
                text: 'this idea agiccc',
                votes: 5,
                avgVotes: '2.0',
                status: 'published'
            }, {
                firstName: 'Peter',
                lastName: 'Pan',
                email: 'peter@demo',
                text: 'idea sis magiccc',
                votes: 25,
                avgVotes: '5.0',
                status: 'published'
            }, {
                firstName: 'Peter',
                lastName: 'Pan',
                email: 'peter@demo',
                text: 'Wir sehen das vom Layout dann passt denn soviele Zeichen sind gar nicht so wenig und man muss ja auch die Breite jedes Buchstaben berücksichtigen zumindest grob.',
                votes: 113,
                avgVotes: 4.5,
                status: 'published'
            }];
        }

        service.getAll = getAll;
        service.getCampaigns = getCampaigns;
        service.getCampaign = getCampaign;
        service.getOwnIdeas = getOwnIdeas;
        service.createIdea = createIdea;

        return service;
    });
