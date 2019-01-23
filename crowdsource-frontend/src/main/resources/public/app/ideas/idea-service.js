angular.module('crowdsource')

    .factory('Idea', function ($resource, $q) {

        var service = {};

        function getCampaigns() {
            var deferred = $q.defer();
            deferred.resolve([
                {
                    id: "1",
                    title: "Weniger Müll",
                    startDate: "",
                    endDate: "",
                    teaser: "Blind Text TextTExtBlind Text TextTExtBlind Text TextTExtBlind Text TextTExt",
                    sponsor: "Mathias Döpfner"
                },
                {
                    id: "2",
                    title: "AS Ideas Team Events",
                    startDate: "",
                    endDate: "",
                    teaser: "Lorem ipsum dolor sit amet,consetetur sadipscing elitr",
                    sponsor: "Michael Alber"
                }
            ]);
            return deferred.promise;
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
