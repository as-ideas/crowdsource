angular.module('crowdsource')

    .factory('Idea', function ($resource) {

        function getAll() {
            console.log('dd');
            return [{
                author: 'peter@demo',
                text: 'thismagiccc',
                votes: 5,
                avgVotes: 4,
                status: 'published'
            },{
                author: 'peter@demo',
                text: 'this idea sis m',
                votes: 5,
                avgVotes: 1,
                status: 'published'
            },{
                author: 'peter@demo',
                text: 'this idea agiccc',
                votes: 5,
                avgVotes: 2,
                status: 'published'
            },{
                author: 'peter@demo',
                text: 'idea sis magiccc',
                votes: 5,
                avgVotes: 5,
                status: 'published'
            }];
        }

        return {
            getAll: getAll
        };
    });
