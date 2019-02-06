xdescribe('idea add', function () {

    var $scope, $httpBackend, $compile;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function ($rootScope, _$httpBackend_, _$compile_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $compile = _$compile_;
        });

        $scope.campaign = {id: '12', title: '', teaser:'asdasdsd', endDate: '123123', startDate: '123123'};
    });

    it("should display the empty form on initialize", function () {
        $httpBackend.expectGET("/ideas_campaigns/" + $scope.campaign.id + "/my_ideas").respond(200, []);
        var ideaAddView = compileDirective($scope);

        $httpBackend.flush();
        expect(ideaAddView.getTitleInput()).toEqual("");
        expect(ideaAddView.getPitchInput()).toEqual("");
        expect(ideaAddView.getSubmitButton()).toBeDisabled();
    });

    it("should display enable the submit button when title and pitch are entered", function () {

        $httpBackend.expectGET("/ideas_campaigns/" + $scope.campaign.id + "/my_ideas").respond(200, []);
        var ideaAddView = compileDirective($scope);
        ideaAddView.setTitle("title123");
        ideaAddView.setPitch("pitch123");


        $scope.$digest();
        $httpBackend.flush();
        expect(ideaAddView.getSubmitButton()).not.toBeDisabled();
    });

    it("should send pitch and title to backend", function () {
        $httpBackend.expectGET("/ideas_campaigns/" + $scope.campaign.id + "/my_ideas").respond(200, []);
        var enteredIdea = {title: "title123", pitch: "pitch123"};
        var ideaAddView = compileDirective($scope);
        ideaAddView.setTitle(enteredIdea.title);
        ideaAddView.setPitch(enteredIdea.pitch);
        $scope.$digest();
        $httpBackend.flush();

        $httpBackend.expectPOST('/ideas_campaigns/'+$scope.campaign.id+'/ideas?status=', {title: enteredIdea.title, pitch: enteredIdea.pitch}).respond({});
        ideaAddView.submitForm();
        $scope.$digest();


        expect().not.toBeDisabled();
    });

    function compileDirective($scope) {
        var view = $compile('<idea-add campaign="campaign"></idea-add>')($scope);
        $scope.$digest();
        return new IdeaAdd(view);
    }
});