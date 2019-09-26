angular.module('crowdsource')

    .controller('ProjectListController', function ($location, Authentication, Project) {

        var vm = this;

        vm.auth = Authentication;
        vm.projects = Project.getAll();

        vm.showProjectDetails = function (project) {
            $location.path('/project/' + project.id);
        };

        vm.projectOrderByStatus = function (project) {

            // scores for states
            var score = 1;
            var projectScores = {
                'PROPOSED': score++,
                'PUBLISHED': score++,
                'PUBLISHED_DEFERRED': score++,
                'DEFERRED': score++,
                'FULLY_PLEDGED': score++,
                'REJECTED': score++
            };

            // get score for state
            var projectScore = projectScores[project.status];

            // return score or max score
            return projectScore || score;
        };

        vm.projectOrderByDate = function (project) {
            var timestamp = new Date(project.lastModifiedDate).getTime();

            // sort descending
            return (-1) * timestamp;
        }
    });
