angular.module('crowdsource')

    .factory('Idea', function ($resource) {

        function getAll() {
            return [];
        }

        return {
            getAll: getAll
        };
    });
