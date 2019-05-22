describe('intro page', function () {

    var intro, Authentication, template, $controller, $rootScope, $compile, Project, $httpBackend, Idea;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');


        localStorage.clear();
        mockTranslation();

        inject(function (_$compile_, _$rootScope_, $templateCache, _$controller_, $q, _Project_, _Idea_, _Authentication_, _$httpBackend_) {
            $compile = _$compile_;
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            Authentication = _Authentication_;
            Project = _Project_;
            Idea = _Idea_;
            $httpBackend = _$httpBackend_;

            spyOn(Project, "getCampaigns").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve([]);
                return deferred.promise;
            });

            template = $templateCache.get('app/intro/intro.html');
        });

    });


    it('should render the list of ideas and prototypes if user is logged in', function () {
        var scope = $rootScope.$new();
        Authentication.currentUser.loggedIn = true;

        $httpBackend.expectGET('/ideas_campaigns').respond(200, [
            {id: 123, title: 'some title'},
            {id: 2, title: 'another one'}
        ]);

        $controller('IntroController as intro', {
            $scope: scope,
            Project: Project,
            Idea: Idea,
            Authentication: Authentication
        });
        intro = $compile('<div>' + template + '<div>')(scope);
        scope.$digest();

        var ideasCampaign = intro.find('intro-ideas-campaign-list');
        expect(ideasCampaign.length).toEqual(1);

        var prototypeCampaign = intro.find('intro-prototypes-campaign-list');
        expect(prototypeCampaign.length).toEqual(1);
    });

    it('should show login button if user is not logged in and not the campaign lists', function () {
        var scope = $rootScope.$new();

        Authentication.currentUser.loggedIn = false;

        $controller('IntroController as intro', {
            $scope: scope,
            Project: Project,
            Idea: Idea,
            Authentication: Authentication
        });
        intro = $compile('<div>' + template + '<div>')(scope);
        scope.$digest();

        var prototypeCampaign = intro.find('intro-prototype-campaign-list');
        var ideasCampaign = intro.find('intro-ideas-campaign-list');
        expect(prototypeCampaign.length).toEqual(0);
        expect(ideasCampaign.length).toEqual(0);

        var loginButton = intro.find('a');
        expect(loginButton).toContainText('Login');

    });
});