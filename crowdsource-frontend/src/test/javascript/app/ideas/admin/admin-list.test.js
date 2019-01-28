describe('admin list', function () {

    var $httpBackend, view, template, MOCKED_CAMPAIGN, adminPage;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        MOCKED_CAMPAIGN = {
            id: '123',
            title: 'some campaign title',
            description: 'some campaign description'
        };

        template = $templateCache.get('app/ideas/admin/admin-list.html');
    });

    it('should render the list of ideas and prototypes if user is logged in', function () {
        var scope = $rootScope.$new();

        $controller('IdeasAdminController as ideasList', {
            campaign: MOCKED_CAMPAIGN,
            Idea: Idea
        });
        view = $compile('<div>' + template + '<div>')(scope);
        scope.$digest();
        adminPage = new AdminList(view);
    });

    function givenPendingIdeasExist(ideas) {
        $httpBackend.expectGET('/ideas_campaigns/' + MOCKED_CAMPAIGN.id + '/pending').respond(200, ideas);
    }

    function givenRejectedIdeasExist(ideas) {
        $httpBackend.expectGET('/ideas_campaigns/' + MOCKED_CAMPAIGN.id + '/rejected').respond(200, ideas);
    }
});