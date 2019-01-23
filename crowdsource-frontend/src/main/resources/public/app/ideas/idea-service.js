angular.module('crowdsource')

    .factory('Idea', function ($resource) {

        var service = {};

        var ideaCampaignResource = $resource('/ideas_campaigns', {}, {
            get: {
                isArray: true,
                method: 'GET'
            }
        });

        function getCampaigns() {
            return ideaCampaignResource.get().$promise;
        }

        function getAll() {

            return [{
                author: 'peter@demo',
                text: 'thismagiccc',
                votes: 5,
                avgVotes: 4,
                status: 'published'
            }, {
                author: 'peter@demo',
                text: 'this idea sis m',
                votes: 5,
                avgVotes: 1,
                status: 'published'
            }, {
                author: 'peter@demo',
                text: 'this idea agiccc',
                votes: 5,
                avgVotes: 2,
                status: 'published'
            }, {
                author: 'peter@demo',
                text: 'idea sis magiccc',
                votes: 5,
                avgVotes: 5,
                status: 'published'
            }];
        }


        service.getAll = getAll;
        service.getCampaigns = getCampaigns;

        return service;
    });
