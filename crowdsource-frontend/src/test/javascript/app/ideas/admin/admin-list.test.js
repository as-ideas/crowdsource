describe('admin list', function () {

    var $scope, $httpBackend, view, template, MOCKED_CAMPAIGN, adminPage, $location, $rootScope, Route, IDEAS_STATUS;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();
        mockTranslation();

        MOCKED_CAMPAIGN = {
            id: '123',
            title: 'some campaign title',
            description: 'some campaign description'
        };
        inject(function ($compile, _$rootScope_, $templateCache, _$controller_, _$location_, $q,_Idea_, _Authentication_, _$httpBackend_, _Route_, _IDEAS_STATUS_) {
            $controller = _$controller_;
            Authentication = _Authentication_;
            Idea = _Idea_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            $rootScope = _$rootScope_;
            Route = _Route_;
            IDEAS_STATUS = _IDEAS_STATUS_;

            template = $templateCache.get('app/ideas/admin/admin-list.html');
            $scope = $rootScope.$new();

            $controller('IdeasAdminController as admin', {
                $scope: $scope,
                campaign: MOCKED_CAMPAIGN,
                Idea: Idea
            });
            view = $compile('<div>' + template + '<div>')($scope);
            $scope.$digest();
            adminPage = new AdminList(view);
        });
    });

    /* FUCKING ANGULAR LIFECYLCE TESTING
    it('should redirect to login page if user is not admin', function () {
        Authentication.currentUser.loggedIn = true;
        Authentication.currentUser.roles = ['ROLE_USER'];

        $location.path('/ideas/' + MOCKED_CAMPAIGN.id + '/admin');
        $rootScope.$digest();

        expect($location.path()).toBe('/error/notfound')
    });


    it('should load page if user is admin', function () {
        Authentication.currentUser.loggedIn = true;
        Authentication.currentUser.roles = ['ROLE_ADMIN'];

        $location.path('/ideas/' + MOCKED_CAMPAIGN.id + '/admin');
        $rootScope.$digest();

        expect($location.path()).toBe('/ideas/' + MOCKED_CAMPAIGN.id + '/admin')
    });




    it("should load given campaign before rendering", function () {
        $httpBackend.expectGET("/ideas_campaigns/" + MOCKED_CAMPAIGN.id).respond(MOCKED_CAMPAIGN);
        $httpBackend.expectGET("/ideas_campaigns/" + MOCKED_CAMPAIGN.id + "?status="+IDEAS_STATUS.PROPOSED).respond(MOCKED_CAMPAIGN);
        $httpBackend.expectGET("/ideas_campaigns/" + MOCKED_CAMPAIGN.id + "?status="+IDEAS_STATUS.REJECTED).respond(MOCKED_CAMPAIGN);

        $location.path('/ideas/' + MOCKED_CAMPAIGN.id + '/admin');
        $scope.$digest();
    });

    */

});