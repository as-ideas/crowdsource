describe('password recovery view', function () {

    var $httpBackend, $location, form;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');
        module(function($provide) {
            $provide.value('emailDomain', '@crowd.source.de');
            $provide.value('emailBlacklistPatterns', ["_extern"])
        });

        localStorage.clear(); // reset

        inject(function ($compile, $rootScope, $templateCache, $controller, _$httpBackend_, _$location_, User, RemoteFormValidation) {
            var $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            $controller('PasswordRecoveryController as passwordRecovery', {
                $scope: $scope,
                $location: $location,
                User: User,
                RemoteFormValidation: RemoteFormValidation
            });

            var template = $templateCache.get('app/user/password-recovery/password-recovery.html');
            var view = $compile(template)($scope);

            $scope.$digest();
            form = new PasswordRecoveryForm(view);
        });
    });

    function expectBackendCallAndRespond(statusCode, responseBody) {
        $httpBackend.expectGET('/user/test@crowd.source.de/password-recovery').respond(statusCode, responseBody);
    }


    it('should show no validation errors when the form is untouched', function () {
        expect(form.getGeneralErrorsContainer()).not.toExist();

        expectNoValidationError('email');
    });

    it('should send the request to the server and redirect to success page', function () {

        // expect a valid call and return "created"
        expectBackendCallAndRespond(201);

        fillAndSubmitForm('test');

        // flush backend (assertion will be evaluated)
        $httpBackend.flush();

        // make sure location was changed
        expect($location.path()).toBe('/login/password-recovery/test@crowd.source.de/success');
    });

    it('should disable the submit button and change it\'s text while loading', function () {
        expectBackendCallAndRespond(201);
        expect(form.getSubmitButton()).toHaveText('Abschicken');
        expect(form.getSubmitButton()).not.toBeDisabled();

        fillAndSubmitForm('test');

        expect(form.getSubmitButton()).toHaveText('Abschicken...');
        expect(form.getSubmitButton()).toBeDisabled();

        $httpBackend.flush();

        expect(form.getSubmitButton()).toHaveText('Abschicken');
        expect(form.getSubmitButton()).not.toBeDisabled();
    });

    it('should show an unknown error when the server responds with 500', function () {

        // spy on path-method
        spyOn($location, 'path');
        expectBackendCallAndRespond(500);

        fillAndSubmitForm('test');
        $httpBackend.flush();
        expect($location.path).not.toHaveBeenCalled();
        expect(form.getGeneralErrorsContainer()).toExist();
        expect(form.getGeneralError('remote_unknown')).toExist();
    });

    it('should show "required" validation errors when the form is submitted without touching the input fields', function () {
        form.getSubmitButton().click();

        expectValidationError('email', 'required');
    });

    it('should show a validation error if the email address is changed to blank', function () {
        form.email.getInputField().val('test').trigger('input');
        form.email.getInputField().val('').trigger('input');

        expectValidationError('email', 'required');
    });

    it('should show a validation error if an invalid email address is entered', function () {
        form.email.getInputField().val('inval@id.mail').trigger('input'); // only the part before the @<domain> is supposed to be entered

        expectValidationError('email', 'email');
    });

    it('should show a validation error if an email address containting "_extern" is entered', function () {
        form.email.getInputField().val('invalid_extern').trigger('input');

        expectValidationError('email', 'non_blacklisted_email');
    });

    it('should show the remote_not_found error if the server responds with 404', function () {
        expectBackendCallAndRespond(404);

        fillAndSubmitForm('test');
        $httpBackend.flush();
        expect(form.getGeneralErrorsContainer()).toExist();
        expect(form.getGeneralError('remote_not_found')).toExist();
    });


    function expectValidationError(inputName, violatedRule) {
        expect(form[inputName].getLabelContainer()).toHaveClass('error');
        expect(form[inputName].getLabel()).toHaveClass('ng-hide');
        expect(form[inputName].getErrorLabelsContainer()).not.toHaveClass('ng-hide');
        expect(form[inputName].getErrorLabelForRule(violatedRule)).toExist();
    }

    function expectNoValidationError(inputName) {
        expect(form[inputName].getLabelContainer()).not.toHaveClass('error');
        expect(form[inputName].getLabel()).not.toHaveClass('ng-hide');
        expect(form[inputName].getErrorLabelsContainer()).toHaveClass('ng-hide');
    }

    function fillAndSubmitForm(emailPart) {
        form.email.getInputField().val(emailPart).trigger('input');
        form.getSubmitButton().click();
    }
});


