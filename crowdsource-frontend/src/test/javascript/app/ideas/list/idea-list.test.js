describe('ideas list', function () {

    var $scope, $httpBackend, $window, $location, renderedView, Authentication;
    var CAMPAIGN = {id: "SOME_ID", title: 'some title', sponsor: 'peter maffay'};

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset, makes the user not logged in
        mockTranslation();

        inject(function ($compile, $rootScope, $templateCache, _$window_, $controller, _$location_, _$httpBackend_, Idea, _Authentication_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $window = _$window_;
            $location = _$location_;
            Authentication = _Authentication_;

            $controller('IdeasListController as ideasList', {
                $scope: $scope,
                Idea: Idea,
                campaign: CAMPAIGN
            });

            var template = $templateCache.get('app/ideas/list/ideas-list.html');
            renderedView = $compile('<div>' + template + '</div>')($scope);
        });

    });

    it("should load given campaign before rendering", function () {
        givenInitialRequestsOnPageLoadResonpond();
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID").respond(CAMPAIGN);
        $scope.$digest();

        $location.path('/ideas/' + CAMPAIGN.id);
    });

    it("should render title and sponsor", function () {
        givenInitialRequestsOnPageLoadResonpond();

        $scope.$digest();
        var listView = new ListView(renderedView);

        expect(listView.getCampaignTitle()).toHaveText(CAMPAIGN.title);
        expect(listView.getCampaignDescription()).toHaveText(CAMPAIGN.sponsor);
    });


    it("Filtering - should load filtered ideas on click to 'not yet voted' and reset ideas model beforehand", function () {
        givenInitialRequestsOnPageLoadResonpond();

        $scope.$digest();
        var listView = new ListView(renderedView);

        $httpBackend.expectGET('/ideas_campaigns/SOME_ID/ideas/filtered?alreadyVoted=false&page=0&pageSize=20').respond(givenExamplIdeaResponse(3));
        listView.clickFilter('NOT_VOTED');

        $httpBackend.flush();
        expect(listView.getIdeas()).toHaveLength(3);
    });

    it("Filtering - should fetch all ideas on click to 'all' ", function () {
        givenInitialRequestsOnPageLoadResonpond();

        $scope.$digest();
        var listView = new ListView(renderedView);

        $httpBackend.expectGET('/ideas_campaigns/SOME_ID/ideas/filtered?alreadyVoted=true&page=0&pageSize=20').respond(givenExamplIdeaResponse(5));
        listView.clickFilter('VOTED');
        $httpBackend.flush();

        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/ideas?page=0&pageSize=20").respond(givenExamplIdeaResponse(10));
        listView.clickFilter('ALL');
        $httpBackend.flush();

        expect(listView.getIdeas()).toHaveLength(10);
    });

    it("Load more should append paged ideas to existing model ", function () {
        var response = givenExamplIdeaResponse(2);
        response.last = false;
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/ideas?page=0&pageSize=20").respond(response);

        $scope.$digest();
        var listView = new ListView(renderedView);
        $httpBackend.flush();

        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/ideas?page=1&pageSize=20").respond(givenExamplIdeaResponse(3));
        listView.clickLoadMore();

        $httpBackend.flush();
        expect(listView.getIdeas()).toHaveLength(5);
    });

    function givenIdea() {
        return {
            id: Math.random(),
            status: 'PUBLISHED',
            title: 'title',
            pitch: 'desc',
            rating: 4.1111111111111111111
        };
    }

    function givenInitialRequestsOnPageLoadResonpond() {
        $httpBackend.expectGET("/ideas_campaigns/SOME_ID/ideas?page=0&pageSize=20").respond(givenExamplIdeaResponse(0));
    }

    function ListView(element) {
        this.element = element;

        this.getCampaignTitle = function () {
            return this.element.find('.ideas-teaser__heading');
        };
        this.getCampaignDescription = function () {
            return this.element.find('.ideas-teaser__sponsor');
        };

        this.getIdeas = function () {
            return this.element.find('.ideas-grid-tile');
        };
        this.clickFilter = function (state) {
            this.element.find('a[name="' + state + '"]').click();
        }
        this.clickLoadMore = function (state) {
            this.element.find('.loadMore__button').click();
        }
    }

    function givenExamplIdeaResponse (count) {
        var exampleIdeas = {
            content: [],
            page: 0,
            number: 0,
            pageSize: 20,
            last: true,
            first: true
        };
        for(var i = 0; i<count; i++) {
            exampleIdeas.content.push(givenIdea());
        }
        return exampleIdeas;
    }
});
