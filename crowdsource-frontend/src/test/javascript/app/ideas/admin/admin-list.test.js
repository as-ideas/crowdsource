describe('admin list', function () {

    var $scope, $httpBackend, view, template, MOCKED_CAMPAIGN, adminPage, $location;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        MOCKED_CAMPAIGN = {
            id: '123',
            title: 'some campaign title',
            description: 'some campaign description'
        };
        inject(function ($compile, $rootScope, $templateCache, _$controller_, _$location_, $q,_Idea_, _Authentication_, _$httpBackend_) {
            $controller = _$controller_;
            Authentication = _Authentication_;
            Idea = _Idea_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

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

    it('should render the list of ideas and prototypes if user is logged in', function () {
        spyOn(Authentication, 'isAdmin').and.returnValue(true);
    });

    it("should load given campaign before rendering", function () {
        $httpBackend.expectGET("/ideas_campaigns/" + MOCKED_CAMPAIGN.id).respond(MOCKED_CAMPAIGN);
        $location.path('/ideas/' + MOCKED_CAMPAIGN.id + '/admin');
        $scope.$digest();
    });
});