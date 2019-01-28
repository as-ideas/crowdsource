describe('ideas list', function () {

    var $scope, $httpBackend, $window, $location, ideasCampaignView, Authentication;
    var CAMPAIGN = {id: "SOME_ID", title: 'some title', sponsor: 'peter maffay' };

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset, makes the user not logged in

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
            ideasCampaignView = $compile('<div>' + template + '</div>')($scope);
            $scope.$digest();

        });
    });

    it("should load given campaign before rendering", function () {
        $httpBackend.expectGET("/ideas_campaigns/" + CAMPAIGN.id).respond(CAMPAIGN);

        $location.path('/ideas/' + CAMPAIGN.id);
        $scope.$digest();
    });

    it("should render title and sponsor", function () {
        $scope.$digest();
        expect(ideasCampaignView.find('.ideas-teaser__heading')).toHaveText(CAMPAIGN.title);
        expect(ideasCampaignView.find('.ideas-teaser__sponsor')).toHaveText(CAMPAIGN.sponsor);
    });
});
