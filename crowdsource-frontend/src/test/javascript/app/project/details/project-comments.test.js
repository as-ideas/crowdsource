describe('project comments directive', function () {

    var $scope, $compile, $httpBackend;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset
        mockTranslation();

        inject(function ($rootScope, _$compile_, _$httpBackend_, Authentication) {
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;

            Authentication.currentUser = {name: 'Current User'};
        });
    });

    function compileDirective() {
        var root = $compile('<project-comments project="project"></project-comments>')($scope);
        $scope.$digest();
        return {
            root: root,
            commentsPanel: root.find('.comments'),
            commentControls: new FormGroup(root.find('.new-comment .form-controls-comment'), 'textarea'),
            submitButton: root.find('.new-comment button[type="submit"]')
        };
    }

    it("should show the comments of the project", function () {

        var date1 = moment();
        var date2 = date1.add(5, 'days');

        $scope.project = {id: 'xxyyzz'};
        $httpBackend.expectGET('/project/xxyyzz/comments').respond(200, [
            {"created": date1.toISOString(), "userName": "User Name", "comment": "aa"},
            {"created": date2.toISOString(), "userName": "Foo Bart", "comment": "foooaaah text\n\naargh"}]);

        var elements = compileDirective();

        expect(elements.commentsPanel).toHaveClass('ng-hide');

        $httpBackend.flush();

        expect(elements.commentsPanel).not.toHaveClass('ng-hide');

        var comments = elements.commentsPanel.find('.comment');
        expect(comments).toHaveLength(2);

        expect($(comments[0]).find('.comment-user')).toHaveText('User Name');
        expect($(comments[0]).find('.comment-date').text()).toBe(date1.format('DD.MM.YY HH:mm'));
        expect($(comments[0]).find('.comment-comment')).toHaveText('aa');

        expect($(comments[1]).find('.comment-user')).toHaveText('Foo Bart');
        expect($(comments[1]).find('.comment-date').text()).toBe(date2.format('DD.MM.YY HH:mm'));
        expect($(comments[1]).find('.comment-comment')).toHaveText('foooaaah text\n\naargh');
    });

    it("should not show the comments panel if there are no comments for this project", function () {

        $scope.project = {id: 'xxyyzz'};
        $httpBackend.expectGET('/project/xxyyzz/comments').respond(200, []);

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.commentsPanel).toHaveClass('ng-hide');
    });

    it("should add a comment", function () {
        $scope.project = {id: 'xxyyzz'};
        $httpBackend.expectGET('/project/xxyyzz/comments').respond(200, []);

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.submitButton).toBeDisabled();
        expect(elements.submitButton).toHaveText('Kommentieren');

        elements.commentControls.getInputField().val('new comment').trigger('input');
        expect(elements.submitButton).not.toBeDisabled();

        $httpBackend.expectPOST('/project/xxyyzz/comment', {"comment": "new comment"}).respond(201);
        $httpBackend.expectGET('/project/xxyyzz/comments').respond(200, [{comment: 'new comment', userName: 'Current User'}]);

        elements.submitButton.click();
        expect(elements.submitButton).toBeDisabled();
        expect(elements.submitButton).toHaveText('Kommentieren...');

        $httpBackend.flush();

        expect(elements.submitButton).toHaveText('Kommentieren');
        expect(elements.submitButton).toBeDisabled();

        // expect the form to be in pristine state, without validation errors
        expect(elements.commentControls.getInputField()).toHaveValue('');
        expectNoValidationError(elements.commentControls);
        expect(elements.root.find('.general-error')).not.toExist();
    });

    it("should show a required error if the comment field is filled and cleared again", function () {
        $scope.project = {id: 'xxyyzz'};
        $httpBackend.expectGET('/project/xxyyzz/comments').respond(200, []);

        var elements = compileDirective();
        $httpBackend.flush();

        expectNoValidationError(elements.commentControls);

        elements.commentControls.getInputField().val('new comment').trigger('input');
        elements.commentControls.getInputField().val('').trigger('input');

        expectValidationError(elements.commentControls, 'required');
    });

    it("should show a remote_unknown error if an unknown error occurred", function () {
        $scope.project = {id: 'xxyyzz'};
        $httpBackend.expectGET('/project/xxyyzz/comments').respond(200, []);

        var elements = compileDirective();
        $httpBackend.flush();

        elements.commentControls.getInputField().val('new comment').trigger('input');

        $httpBackend.expectPOST('/project/xxyyzz/comment', {"comment": "new comment"}).respond(500);

        elements.submitButton.click();
        $httpBackend.flush();

        expectNoValidationError(elements.commentControls);
        expect(elements.root.find('.general-error')).toExist();
        expect(getGeneralError(elements, 'remote_unknown')).toExist();
    });


    function expectValidationError(formGroup, violatedRule) {
        expect(formGroup.getLabelContainer()).toHaveClass('error');
        expect(formGroup.getLabel()).toHaveClass('ng-hide');
        expect(formGroup.getErrorLabelsContainer()).not.toHaveClass('ng-hide');
        expect(formGroup.getErrorLabelForRule(violatedRule)).toExist();
    }

    function expectNoValidationError(formGroup) {
        expect(formGroup.getLabelContainer()).not.toHaveClass('error');
        expect(formGroup.getLabel()).not.toHaveClass('ng-hide');
        expect(formGroup.getErrorLabelsContainer()).toHaveClass('ng-hide');
    }

    function getGeneralError(elements, errorCode) {
        return elements.root.find('[ng-message="' + errorCode + '"]');
    }
});
