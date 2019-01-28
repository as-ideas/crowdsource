describe('idea add', function () {

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

        var ideaAddView = compileDirective($scope);

        expect(ideaAddView.getTitleInput()).toEqual("");
        expect(ideaAddView.getPitchInput()).toEqual("");
        expect(ideaAddView.getSubmitButton()).toBeDisabled();
    });


    it("should display enable the submit button when title and pitch are entered", function () {

        var ideaAddView = compileDirective($scope);
        ideaAddView.setTitle("title123");
        ideaAddView.setPitch("pitch123");
        $scope.$digest();

        expect(ideaAddView.getSubmitButton()).not.toBeDisabled();
    });

    it("should send pitch and title to backend", function () {

        var enteredIdea = {title: "title123", pitch: "pitch123"};
        var ideaAddView = compileDirective($scope);
        ideaAddView.setTitle(enteredIdea.title);
        ideaAddView.setPitch(enteredIdea.pitch);
        $scope.$digest();

        $httpBackend.expectPOST('/ideas_campaigns/'+$scope.campaign.id+'/ideas', {title: enteredIdea.title, pitch: enteredIdea.pitch}).respond({});
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