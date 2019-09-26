angular.module('crowdsource')

    .factory('Content', function ($q, $http) {
        var service = {};
        var cachedContent, promise;

        service.get = function (key) {
            var deferred = $q.defer();

            // explanation at https://www.youtube.com/watch?v=33kl0iQByME from 13:50
            $q.when(cachedContent || promise || load()).then(function (content) {
                var value = content[key] || "";
                deferred.resolve(value);
            });

            return deferred.promise;
        };

        function load() {
            var deferred = $q.defer();
            promise = deferred.promise;

            $http.get('/content').success(function (content) {
                cachedContent = content;
                deferred.resolve(content);
            });

            return deferred.promise;
        }

        return service;
    })

    .directive('content', function (Content) {
        return {
            restrict: 'E',
            scope: {
                key: '@'
            },
            template: '<span>{{ content }}</span>',
            controller: function ($scope) {

                Content.get($scope.key).then(function (value) {
                    $scope.content = value;
                });
            }
        }
    });
