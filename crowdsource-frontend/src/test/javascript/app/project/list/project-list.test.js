describe('project list', function () {

    var $scope, $httpBackend, $location, projectList;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();
        mockTranslation();

        inject(function ($compile, $rootScope, $templateCache, $controller, $q, _$httpBackend_, _$location_, Project, Content) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            $controller('ProjectListController as projectList', {
                $scope: $scope,
                $location: _$location_,
                Project: Project
            });

            spyOn(Content, "get").and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve("foo");
                return deferred.promise;
            });

            var template = $templateCache.get('app/project/list/project-list.html');

            // wrap the template in a <div>, or $compile will return multiple elements for each top level element
            projectList = $compile('<div>' + template + '<div>')($scope);
        });
    });

    it('should display the projects that were retrieved from backend', function () {

        var date = new Date();

        var projects = [
            project('Title', 'Short Description', 100, 10, 1, 'PUBLISHED', date),
            project('Title 2', 'Short Description 2', 100, 20, 2, 'PUBLISHED', date.setSeconds(date.getSeconds() + 5))
        ];

        $httpBackend.expectGET('/projects').respond(200, projects);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(404);
        $scope.$digest();
        $httpBackend.flush();

        var listItems = projectList.find('.project__tile');
        expect(listItems).toHaveLength(2);
        expect($(listItems[0]).find('.tile__heading')).toHaveText('Title');
        expect($(listItems[0]).find('p')).toHaveText('Short Description');
        expect($(listItems[0]).find('.cs-progress__meter').css("width")).toBe("10%");
        expect($(listItems[0]).find('.backers-count')).toHaveText('1');
        expect($(listItems[0]).find('.pledged-amount').text()).toBe('10 / 100');

        expect($(listItems[1]).find('.tile__heading')).toHaveText('Title 2');
        expect($(listItems[1]).find('p')).toHaveText('Short Description 2');
        expect($(listItems[1]).find('.cs-progress__meter').css("width")).toBe("20%");
        expect($(listItems[1]).find('.backers-count')).toHaveText('2');
        expect($(listItems[1]).find('.pledged-amount').text()).toBe('20 / 100');

        expect(projectList.find('.no-projects')).toHaveClass('ng-hide');
    });

    it('should display projects in correct order and set classes based on project status', function () {

        var now = moment();
        $httpBackend.expectGET('/projects').respond(200, [
            project('Title 0', 'Short Description 0', 100, 10, 1, 'PUBLISHED', moment(now).subtract(2, 'days')),
            project('Title 1', 'Short Description 1', 100, 10, 1, 'PUBLISHED_DEFERRED', moment(now).subtract(1, 'days')),
            project('Title 2', 'Short Description 2', 100, 10, 1, 'PUBLISHED', moment(now).subtract(4, 'days')),
            project('Title 3', 'Short Description 3', 100, 20, 2, 'FULLY_PLEDGED', moment(now).subtract(1, 'days')),
            project('Title 4', 'Short Description 4', 100, 20, 2, 'REJECTED', moment(now).subtract(1, 'days')),
            project('Title 5', 'Short Description 5', 100, 20, 2, 'PROPOSED', moment(now).subtract(1, 'days')),
            project('Title 6', 'Short Description 6', 100, 20, 2, 'DEFERRED', moment(now).subtract(1, 'days'))
        ]);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(404);
        $scope.$digest();
        $httpBackend.flush();

        var listItems = projectList.find('.project__tile');
        expect(listItems).toHaveLength(7);

        expect($(listItems[0]).find('.tile__heading').text()).toBe('Title 5');
        expect($(listItems[0]).hasClass("project-proposed")).toBeTruthy();


        expect($(listItems[1]).find('.tile__heading').text()).toBe('Title 0');
        expect($(listItems[2]).hasClass("project-published")).toBeTruthy();

        expect($(listItems[2]).find('.tile__heading').text()).toBe('Title 2');
        expect($(listItems[2]).hasClass("project-published")).toBeTruthy();

        expect($(listItems[3]).find('.tile__heading').text()).toBe('Title 1');
        expect($(listItems[3]).hasClass("project-published_deferred")).toBeTruthy();

        expect($(listItems[4]).find('.tile__heading').text()).toBe('Title 6');
        expect($(listItems[4]).hasClass("project-deferred")).toBeTruthy();

        expect($(listItems[5]).find('.tile__heading').text()).toBe('Title 3');
        expect($(listItems[5]).hasClass("project-fully_pledged")).toBeTruthy();

        expect($(listItems[6]).find('.tile__heading').text()).toBe('Title 4');
        expect($(listItems[6]).hasClass("project-rejected")).toBeTruthy();

    });

    it("should redirect to the project's details page when the project tile is clicked", function () {
        $httpBackend.expectGET('/projects').respond(200, [
            project('Title', 'Short Description', 100, 10, 1)
        ]);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(404);

        $scope.$digest();
        $httpBackend.flush();

        var tile = projectList.find('.project__tile_clicktarget');
        tile.click();

        expect($location.path()).toBe('/project/projectId');
    });

    it('should show a message if no projects exist yet', function () {
        var emptyProjectList = [];
        $httpBackend.expectGET('/projects').respond(200, emptyProjectList);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(404);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectList.find('.no-projects')).not.toHaveClass('ng-hide');
    });

    it('should hide the "create a new project" section while loading', function () {
        $httpBackend.expectGET('/projects').respond(200, []);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(404);

        $scope.$digest();

        expect(projectList.find('.no-projects')).toHaveClass('ng-hide');

        $httpBackend.flush();

        expect(projectList.find('.no-projects')).not.toHaveClass('ng-hide');
    });

    function project(title, shortDescription, pledgeGoal, pledgedAmount, backers, status, lastModifiedDate) {
        var project = {};
        project.id = 'projectId';
        project.title = title;
        project.shortDescription = shortDescription;
        project.pledgeGoal = pledgeGoal;
        project.pledgedAmount = pledgedAmount;
        project.backers = backers;
        project.status = status;
        project.lastModifiedDate = lastModifiedDate;
        return project;
    }
});
