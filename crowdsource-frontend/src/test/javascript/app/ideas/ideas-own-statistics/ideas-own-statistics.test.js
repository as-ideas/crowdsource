describe('Ideas Own Statistics', function () {

    var $rootScope, $scope, $httpBackend, $compile;

    var mockedIdeas = [{
        "id": "5c51647e950c5f6d616dcd12",
        "creatorName": "Admin",
        "status": "REJECTED",
        "creationDate": 1548838014766,
        "title": "Masterplan",
        "pitch": "Master Idee"
    }, {
        "id": "5c516b0f950c5f6d616dcd13",
        "creatorName": "Admin",
        "status": "PUBLISHED",
        "creationDate": 1548839695979,
        "title": "Weltherrschaft",
        "pitch": "Werte Herrschaften der Welt Herrschaft"
    }, {
        "id": "5c516b9d950c5f6d616dcd14",
        "creatorName": "Admin",
        "status": "PUBLISHED",
        "creationDate": 1548839837033,
        "title": "Noch eine Idee",
        "pitch": "Warum auch nicht, es ist ganz leicht"
    }];

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function (_$rootScope_, _$httpBackend_, _$compile_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $compile = _$compile_;
        });

        $scope.campaign = {id: 'testcampaign_id', title: '', teaser:'asdasdsd', endDate: '123123', startDate: '123123'};
    });

    function compileDirective($scope) {
        var view = $compile('<ideas-own-statistics campaign="campaign" ideas="ideas"></ideas-own-statistics>')($scope);
        $scope.$digest();
        return new IdeasOwnStatistics(view);
    }


    it("should display the correct number of proposed, approved and rejected ideas", function () {

        $httpBackend.expectGET('/ideas_campaigns/testcampaign_id/my_ideas').respond(200, mockedIdeas);

        var view = compileDirective($scope);
        $httpBackend.flush();

        expect(view.getProposedCount()).toBe('0');
        expect(view.getApprovedCount()).toBe('2');
        expect(view.getRejectedCount()).toBe('1');
    });

    it("should display the correct number of proposed, approved and rejected ideas without backend call when ideas data is provided", function () {
        $scope.ideas = mockedIdeas;
        var view = compileDirective($scope);

        expect(view.getProposedCount()).toBe('0');
        expect(view.getApprovedCount()).toBe('2');
        expect(view.getRejectedCount()).toBe('1');
    });

});