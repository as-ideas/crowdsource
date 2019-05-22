describe('Own ideas list', function () {

    var $scope, $httpBackend, $window, $location, renderedView, Authentication, IDEAS_STATUS;
    var CAMPAIGN = {id: "SOME_ID", title: 'some title', sponsor: 'peter maffay' };

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset, makes the user not logged in
        mockTranslation();

        inject(function ($compile, $rootScope, $templateCache, _$window_, $controller, _$location_, _$httpBackend_, Idea, _IDEAS_STATUS_, _Authentication_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $window = _$window_;
            $location = _$location_;
            Authentication = _Authentication_;
            IDEAS_STATUS = _IDEAS_STATUS_;

            $controller('IdeasOwnController as ideasList', {
                $scope: $scope,
                Idea: Idea,
                campaign: CAMPAIGN
            });

            var template = $templateCache.get('app/ideas/own/own-list.html');
            renderedView = $compile('<div>' + template + '</div>')($scope);
        });
    });

    it("should load given campaign before rendering", function () {
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/my_ideas").respond([]);
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID").respond(CAMPAIGN);
        $scope.$digest();

        $location.path('/ideas/' + CAMPAIGN.id + "/own");
    });

    it("should render title and sponsor", function () {
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/my_ideas").respond(200, []);
        $scope.$digest();

        expect(renderedView.find('.ideas-teaser__heading')).toHaveText(CAMPAIGN.title);
        expect(renderedView.find('.ideas-teaser__sponsor')).toHaveText(CAMPAIGN.sponsor);
    });

    it("should render empty list of ideas grouped by state showing default message", function () {
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/my_ideas").respond(200, []);

        $scope.$digest();
        var view = new OwnIdeasView(renderedView);

        expect(view.getProposedIdeas()).toHaveLength(0);
        expect(view.getPublishedIdeas()).toHaveLength(0);
        expect(view.getRejectedIdeas()).toHaveLength(0);
        expect(view.getEmptyLabels()).toHaveLength(3);
    });

    it("should render list of ideas grouped by state", function () {
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/my_ideas").respond(200, givenIdeasOfEveryState());

        $scope.$digest();
        var view = new OwnIdeasView(renderedView);

        $httpBackend.flush();
        expect(view.getPublishedIdeas()).toHaveLength(1);
        expect(view.getProposedIdeas()).toHaveLength(2);
        expect(view.getRejectedIdeas()).toHaveLength(3);
        expect(view.getEmptyLabels()).toHaveLength(0);
    });

    function givenIdeasOfEveryState() {
        return [
            givenIdea(IDEAS_STATUS.PUBLISHED),
            givenIdea(IDEAS_STATUS.PROPOSED),
            givenIdea(IDEAS_STATUS.PROPOSED),
            givenIdea(IDEAS_STATUS.REJECTED),
            givenIdea(IDEAS_STATUS.REJECTED),
            givenIdea(IDEAS_STATUS.REJECTED)
        ];
    }

    function givenIdea(status) {
        return {
            "id": "5c4b25ef307d0a243bbd000" + (Math.random() + 100) / 100,
            "creatorName": "Admin",
            "status": status,
            "creationDate": 1548428783607,
            "title": "ein paar Z",
            "pitch": "eine kurzer Satz"
        }
    }

});
