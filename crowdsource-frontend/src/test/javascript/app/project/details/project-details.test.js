describe('project details', function () {

    var $scope, $httpBackend, $window, $location, AuthenticationToken, FinancingRound, projectDetails;
    var financingRoundMock;
    var PROJECT_CREATOR_MAIL = 'foo.bar@axel.de';

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');
        module(function(_$analyticsProvider_) {
            _$analyticsProvider_.virtualPageviews(false);
            _$analyticsProvider_.firstPageview(false);
            _$analyticsProvider_.developerMode(true);
        });

        localStorage.clear(); // reset, makes the user not logged in

        inject(function ($compile, $rootScope, $templateCache, _$window_, $controller, _$location_, _$httpBackend_, Project, _AuthenticationToken_, _FinancingRound_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $window = _$window_;
            $location = _$location_;
            AuthenticationToken = _AuthenticationToken_;
            FinancingRound = _FinancingRound_;

            $controller('ProjectDetailsController as projectDetails', {
                $scope: $scope,
                $location: $location,
                $routeParams: {
                    projectId: 'xyz'
                },
                Project: Project
            });

            financingRoundMock = {active: true};
            $httpBackend.whenGET('/financingrounds/mostRecent').respond(200, financingRoundMock);

            var template = $templateCache.get('app/project/details/project-details.html');
            projectDetails = $compile(template)($scope);
        });
    });

    function prepareProjectMock(projectStatus) {

        $httpBackend.expectGET('/project/xyz').respond(200, {
            id: 'xyz',
            status: projectStatus,
            title: 'Title',
            shortDescription: 'Short description',
            description: 'Looong description',
            creator: {name: 'Foo Bar', email: PROJECT_CREATOR_MAIL},
            pledgedAmount: 13853,
            pledgeGoal: 20000,
            backers: 7
        });
    }

    it("should display the project's details that were retrieved from backend", function () {

        prepareProjectMock('PUBLISHED');

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('h1').text()).toBe('Title');
        expect(projectDetails.find('.pd-creator strong').text()).toBe('Foo Bar');
        expect(projectDetails.find('.pd-creator a')).not.toExist();
        expect(projectDetails.find('progress-bar .cs-progress__meter').css('width')).toBe('69.265%');
        expect(projectDetails.find('.project-status__pledge-goal').text()).toBe('20.000');
        expect(projectDetails.find('.project-status__pledged-amount').text()).toBe('13.853');
        expect(projectDetails.find('.project-status__backers').text()).toBe('7');
        expect(projectDetails.find('.project-short-description').text()).toBe('Short description');
        expect(projectDetails.find('.project-description').text()).toBe('Looong description');
        expect(projectDetails.find('.to-pledging-form-button').text()).not.toBeDisabled();
        expect(projectDetails.find('.to-pledging-form-button').text().trim()).toBe('Zur Finanzierung');
        expect(projectDetails.find('.to-pledging-form-button')).toHaveAttr('analytics-on');
        expect(projectDetails.find('.to-pledging-form-button')).toHaveAttr('analytics-category', 'Projects');
        expect(projectDetails.find('.to-pledging-form-button')).toHaveAttr('analytics-event', 'GoToFinancing');

        expect(projectDetails.find('project-comments')).not.toExist();
    });

    it("should display the project creator's email if an admin views the details", function () {

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.pd-creator strong').text()).toBe('Foo Bar');
        expect(projectDetails.find('.pd-creator a')).toExist();
        expect(projectDetails.find('.pd-creator a').attr('href')).toBe('mailto:foo.bar@axel.de');
        expect(projectDetails.find('.pd-creator a').attr('href')).toBe('mailto:foo.bar@axel.de');

        expect(projectDetails.find('.pd-creator a')).toHaveAttr('analytics-on');
        expect(projectDetails.find('.pd-creator a')).toHaveAttr('analytics-category', 'Projects');
        expect(projectDetails.find('.pd-creator a')).toHaveAttr('analytics-event', 'MailToPublisherIconClicked');
    });

    it("should show a not found page if no project was found", function () {

        $httpBackend.expectGET('/project/xyz').respond(404);

        $scope.$digest();
        $httpBackend.flush();

        expect($location.path()).toBe('/error/notfound');
    });

    it("should show a forbidden error page if the server responds with 403", function () {

        $httpBackend.expectGET('/project/xyz').respond(403);

        $scope.$digest();
        $httpBackend.flush();

        expect($location.path()).toBe('/error/forbidden');
    });

    it("should show a technical failure page if the server responds with an unexpected status code", function () {

        $httpBackend.expectGET('/project/xyz').respond(500);

        $scope.$digest();
        $httpBackend.flush();

        expect($location.path()).toBe('/error/unknown');
    });

    it("should show text 'Vorgeschlagen' on the to-pledging-form-button when the project is in status 'PROPOSED'", function () {
        prepareProjectMock('PROPOSED');

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-pledging-form-button')).toBeDisabled();
        expect(projectDetails.find('.to-pledging-form-button')).toHaveText('Vorgeschlagen');
    });

    it("should show text 'Zur Finanzierung' on the to-pledging-form-button when the project is in status 'PUBLISHED'", function () {
        prepareProjectMock('PUBLISHED');

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-pledging-form-button')).not.toBeDisabled();
        expect(projectDetails.find('.to-pledging-form-button')).toHaveText('Zur Finanzierung');
    });

    it("should show text 'Abgelehnt' on the to-pledging-form-button when the project is in status 'REJECTED'", function () {
        prepareProjectMock('REJECTED');

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-pledging-form-button')).toBeDisabled();
        expect(projectDetails.find('.to-pledging-form-button')).toHaveText('Abgelehnt');
    });

    it("should show text 'Zurückgestellt' on the to-pledging-form-button when the project is in status 'DEFERRED'", function () {
        prepareProjectMock('DEFERRED');

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-pledging-form-button')).toBeDisabled();
        expect(projectDetails.find('.to-pledging-form-button')).toHaveText('Zurückgestellt');
    });

    it("should show text 'Zu 100% finanziert' on the to-pledging-form-button when the project is in status 'FULLY_PLEDGED'", function () {
        prepareProjectMock('FULLY_PLEDGED');

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-pledging-form-button')).toBeDisabled();
        expect(projectDetails.find('.to-pledging-form-button')).toHaveText('Zu 100% finanziert!');
    });

    it("should show the comments directive if the user is logged in", function () {
        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('project-comments')).toExist();
    });

    it("should display the publish-button when a project is not published and the user is admin", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.publish-button')).toExist();
        expect(projectDetails.find('.publish-button')).toHaveAttr('analytics-category', 'Projects');
        expect(projectDetails.find('.publish-button')).toHaveAttr('analytics-on');
        expect(projectDetails.find('.publish-button')).toHaveAttr('analytics-event', 'Published');
    });

    it("should display the publish-button when a project is deferred and the user is admin", function () {

        prepareProjectMock('DEFERRED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.publish-button')).toExist();
        expect(projectDetails.find('.publish-button')).toHaveAttr('analytics-category', 'Projects');
        expect(projectDetails.find('.publish-button')).toHaveAttr('analytics-on');
        expect(projectDetails.find('.publish-button')).toHaveAttr('analytics-event', 'Published');
    });

    it("should not display the publish-button when a project is not published and the user is not admin", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.publish-button')).not.toExist();
    });

    it("should not display the publish-button when a project is published", function () {

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.publish-button')).not.toExist();
    });

    it("should not display the publish-button when a project is fully pledged", function () {

        prepareProjectMock('FULLY_PLEDGED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.publish-button')).not.toExist();
    });


    it("should display the reject-button when a project is not reject and the user is admin", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.reject-button')).toExist();
        expect(projectDetails.find('.reject-button')).toHaveAttr('analytics-on');
        expect(projectDetails.find('.reject-button')).toHaveAttr('analytics-category', 'Projects');
        expect(projectDetails.find('.reject-button')).toHaveAttr('analytics-event', 'Rejected');
    });

    it("should not display the reject-button when a project is not published and the user is not admin", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.reject-button')).not.toExist();
    });

    it("should not display the reject-button when a project is rejected", function () {

        prepareProjectMock('REJECTED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.reject-button')).not.toExist();
    });

    it("should not display the reject-button when a project is fully pledged", function () {

        prepareProjectMock('FULLY_PLEDGED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.reject-button')).not.toExist();
    });

    it("should display the defer-button when a project is not rejected and the user is admin and no financing round is active", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : false});

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.defer-button')).toExist();
        expect(projectDetails.find('.defer-button')).toHaveAttr('analytics-on');
        expect(projectDetails.find('.defer-button')).toHaveAttr('analytics-category', 'Projects');
        expect(projectDetails.find('.defer-button')).toHaveAttr('analytics-event', 'Deferred');
    });

    it("should not display the defer-button when there is an active financing round and the user is admin", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : true});

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.defer-button')).not.toExist();
    });

    it("should not display the defer-button when a project is deferred", function () {

        prepareProjectMock('DEFERRED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : false});

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.defer-button')).not.toExist();
    });

    it("should not display the defer-button when a project is fully pledged", function () {

        prepareProjectMock('FULLY_PLEDGED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : false});

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.defer-button')).not.toExist();
    });

    it("should display disabled project edit-button when a project is FULLY_PLEDGED and the user is admin", function () {

        prepareProjectMock('FULLY_PLEDGED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toBeDisabled();
    });

    it("should display enabled project edit-button when a project is not FULLY_PLEDGED and the user is admin", function () {

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = false;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).not.toBeDisabled();
    });

    it("should display enabled project edit-button when a project is not FULLY_PLEDGED and the user is creator", function () {

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER'], email: PROJECT_CREATOR_MAIL });
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = false;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).not.toBeDisabled();
    });

    it("should display disabled project edit-button when a project is not FULLY_PLEDGED and within financing round and the user is creator", function () {

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER'], email: PROJECT_CREATOR_MAIL });
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = true;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).toBeDisabled();
    });

    it("should display disabled project edit-button when a project is not FULLY_PLEDGED and within financing round and the user is admin", function () {

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = true;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).toBeDisabled();
    });

    it("should display disabled project edit-button when a project is FULLY_PLEDGED", function () {

        prepareProjectMock('FULLY_PLEDGED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = false;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).toBeDisabled();
    });

    it("should display enabled project edit-button when a project is PROPOSED even if financing round is active", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = true;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).not.toBeDisabled();
    });

    it("should display enabled project edit-button when a project is DEFERRED even if financing round is active", function () {

        prepareProjectMock('DEFERRED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER'], email: PROJECT_CREATOR_MAIL});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = true;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).toExist();
        expect(projectDetails.find('.to-edit-form-button')).not.toBeDisabled();
    });

    it("should not display project edit-button when a project is PUBLISHED and no financing round is active and the user is not creator and not admin", function () {

        prepareProjectMock('PUBLISHED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER'], email: 'aNob@dy.usr'});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);
        financingRoundMock.active = false;

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        expect(projectDetails.find('.to-edit-form-button')).not.toExist();
    });

    it("should send the patch-request to the backend when the publish-button is clicked and confirmed", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPATCH('/project/xyz/status', { status: 'PUBLISHED'}).respond(200, {status: 'PUBLISHED'});

        spyOn($window, 'confirm').and.returnValue(true);
        projectDetails.find('.publish-button').click();
        $httpBackend.flush();

        expect(projectDetails.find('.publish-button')).not.toExist();
    });

    it("should not send the patch-request to the backend when the publish confirmation is canceled", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        spyOn($window, 'confirm').and.returnValue(false);
        projectDetails.find('.publish-button').click();

        expect(projectDetails.find('.publish-button')).toExist();
    });

    it("should send the patch-request to the backend when the reject-button is clicked and confirmed", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPATCH('/project/xyz/status', {status: 'REJECTED'}).respond(200, {status: 'REJECTED'});
        spyOn($window, 'confirm').and.returnValue(true);
        projectDetails.find('.reject-button').click();
        $httpBackend.flush();

        expect(projectDetails.find('.reject-button')).not.toExist();
    });

    it("should not send the patch-request to the backend when the reject confirmation is canceled", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        spyOn($window, 'confirm').and.returnValue(false);
        projectDetails.find('.reject-button').click();
    });

    it("should send the patch-request to the backend when the defer-button is clicked and confirmed", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : false});

        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPATCH('/project/xyz/status', {status: 'DEFERRED'}).respond(200, {status: 'DEFERRED'});

        spyOn($window, 'confirm').and.returnValue(true);
        projectDetails.find('.defer-button').click();
        $httpBackend.flush();

        expect(projectDetails.find('.defer-button')).not.toExist();
    });

    it("should not send the patch-request to the backend when the defer confirmation is canceled", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : false});
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        spyOn($window, 'confirm').and.returnValue(false);
        projectDetails.find('.defer-button').click();
    });

    it("should redirect to unknown-error page when the reject-request fails", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPATCH('/project/xyz/status', {status: 'REJECTED'}).respond(400);
        spyOn($window, 'confirm').and.returnValue(true);
        projectDetails.find('.reject-button').click();
        $httpBackend.flush();

        expect($location.path()).toBe('/error/unknown');
    });

    it("should redirect to unknown-error page when the publish-request fails", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);

        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPATCH('/project/xyz/status', {status: 'PUBLISHED'}).respond(400);
        spyOn($window, 'confirm').and.returnValue(true);
        projectDetails.find('.publish-button').click();
        $httpBackend.flush();

        expect($location.path()).toBe('/error/unknown');
    });

    it("should redirect to unknown-error page when the defer-request fails", function () {

        prepareProjectMock('PROPOSED');
        $httpBackend.expectGET('/user/current').respond(200, {budget: 55, roles: ['ROLE_USER', 'ROLE_ADMIN']});
        $httpBackend.expectGET('/project/xyz/comments').respond(200, []);

        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(true);
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue({ active : false});

        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPATCH('/project/xyz/status', {status: 'DEFERRED'}).respond(400);
        spyOn($window, 'confirm').and.returnValue(true);
        projectDetails.find('.defer-button').click();
        $httpBackend.flush();

        expect($location.path()).toBe('/error/unknown');
    });
});
