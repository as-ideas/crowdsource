describe('user login view', function () {

    var $httpBackend, $location, Authentication, loginForm;

    beforeEach(function () {

        module('crowdsource');
        module('crowdsource.templates');
        module(function($provide) {
            $provide.value('emailBlacklistPatterns', ["_extern"])
        });

        localStorage.clear(); // reset
        mockTranslation();

        inject(function ($compile, $rootScope, $templateCache, $controller, _$httpBackend_, _$location_, _Authentication_, RemoteFormValidation, Route) {
            var $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            Authentication = _Authentication_;

            $controller('UserLoginController as login', {
                $scope: $scope,
                Authentication: Authentication,
                RemoteFormValidation: RemoteFormValidation,
                Route: Route
            });

            var template = $templateCache.get('app/user/login/user-login.html');
            var view = $compile(template)($scope);

            $scope.$digest();
            loginForm = new LoginForm(view);
        });

    });

    function expectValidationError(inputName, violatedRule) {
        expect(loginForm[inputName].getLabelContainer()).toHaveClass('error');
        expect(loginForm[inputName].getLabel()).toHaveClass('ng-hide');
        expect(loginForm[inputName].getErrorLabelsContainer()).not.toHaveClass('ng-hide');
        expect(loginForm[inputName].getErrorLabelForRule(violatedRule)).toExist();
    }

    function expectNoValidationError(inputName) {
        expect(loginForm[inputName].getLabelContainer()).not.toHaveClass('error');
        expect(loginForm[inputName].getLabel()).not.toHaveClass('ng-hide');
        expect(loginForm[inputName].getErrorLabelsContainer()).toHaveClass('ng-hide');
    }

    function fillAndSubmitForm() {
        loginForm.email.getInputField().val('test@crowd.source.de').trigger('input');
        loginForm.password.getInputField().val('secret!!!').trigger('input');

        loginForm.getSubmitButton().click();
    }

    function expectBackendCallAndRespond(statusCode, responseBody) {
        $httpBackend.expectPOST('/oauth/token', 'username=test%40crowd.source.de&password=secret!!!&client_id=web&grant_type=password')
            .respond(statusCode, responseBody);
    }

    it('should show no validation errors when the form is untouched', function () {
        expect(loginForm.getGeneralErrorsContainer()).not.toExist();

        expectNoValidationError('email');
        expectNoValidationError('password');
    });

    it('should request an access token from the server and redirect to index page', function () {
        expectBackendCallAndRespond(200);
        spyOn(Authentication, 'reloadUser');

        fillAndSubmitForm();

        $httpBackend.flush();
        expect($location.path()).toBe('/');
    });

    it('should disable the submit button and change it\'s text while loading', function () {
        expectBackendCallAndRespond(201);
        spyOn(Authentication, 'reloadUser');

        expect(loginForm.getSubmitButton()).toHaveText('Login');
        expect(loginForm.getSubmitButton()).not.toBeDisabled();

        fillAndSubmitForm();

        expect(loginForm.getSubmitButton()).toHaveText('Login...');
        expect(loginForm.getSubmitButton()).toBeDisabled();

        $httpBackend.flush();

        expect(loginForm.getSubmitButton()).toHaveText('Login');
        expect(loginForm.getSubmitButton()).not.toBeDisabled();
    });

    it('should show an unknown error message when the server responds with 500', function () {

        // spy on path-method
        spyOn($location, 'path');
        expectBackendCallAndRespond(500);

        fillAndSubmitForm();
        $httpBackend.flush();
        expect($location.path).not.toHaveBeenCalled();
        expect(loginForm.getGeneralErrorsContainer()).toExist();
        expect(loginForm.getGeneralError('remote_unknown')).toExist();
    });

    it('should show an unknown error message if the server responds with "an unknown result"', function () {

        // spy on path-method
        spyOn($location, 'path');
        expectBackendCallAndRespond(400, {error: "wooOooodooOoo"});

        fillAndSubmitForm();
        $httpBackend.flush();
        expect($location.path).not.toHaveBeenCalled();
        expect(loginForm.getGeneralErrorsContainer()).toExist();
        expect(loginForm.getGeneralError('remote_unknown')).toExist();
    });

    it('should show an appropriate error message if the server responds with "bad_credentials"', function () {

        // spy on path-method
        spyOn($location, 'path');
        expectBackendCallAndRespond(400, {error: "invalid_grant"});

        fillAndSubmitForm();
        $httpBackend.flush();
        expect($location.path).not.toHaveBeenCalled();
        expect(loginForm.getGeneralErrorsContainer()).toExist();
        expect(loginForm.getGeneralError('remote_bad_credentials')).toExist();
    });

    it('should show "required" validation errors when the form is submitted without touching the input fields', function () {
        loginForm.getSubmitButton().click();

        expectValidationError('email', 'required');
        expectValidationError('password', 'required');
    });

    it('should show a validation error if the email address is changed to blank', function () {
        loginForm.email.getInputField().val('test').trigger('input');
        loginForm.email.getInputField().val('').trigger('input');

        expectValidationError('email', 'required');
    });

    it('should show a validation error if an invalid email address is entered', function () {
        loginForm.email.getInputField().val('invalid.mail').trigger('input'); // only the part before the @<domain> is supposed to be entered

        expectValidationError('email', 'email');
    });

    it('should show a validation error if an email address containting "_extern" is entered', function () {
        loginForm.email.getInputField().val('invalid_extern@as.crowd.de').trigger('input');

        expectValidationError('email', 'non_blacklisted_email');
    });
});
