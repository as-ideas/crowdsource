describe('user activation view', function () {

    var $httpBackend, $location, activationForm;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset
        mockTranslation();

        inject(function (_$httpBackend_, _$location_) {
            $httpBackend = _$httpBackend_;
            $location = _$location_;
        });

    });

    function compileView() {
        inject(function ($compile, $rootScope, $templateCache, $controller, User, Authentication, RemoteFormValidation) {
            var $scope = $rootScope.$new();

            $controller('UserActivationController as activation', {
                $scope: $scope,
                $routeParams: {
                    email: "test@crowd.source.de",
                    activationToken: "12345"
                },
                $location: $location,
                User: User,
                Authentication: Authentication,
                RemoteFormValidation: RemoteFormValidation
            });

            var template = $templateCache.get('app/user/activation/user-activation.html');
            var view = $compile(template)($scope);

            $scope.$digest();
            activationForm = new ActivationForm(view);
        });
    }

    function expectValidationError(inputName, violatedRule) {
        expect(activationForm[inputName].getLabelContainer()).toHaveClass('error');
        expect(activationForm[inputName].getLabel()).toHaveClass('ng-hide');
        expect(activationForm[inputName].getErrorLabelsContainer()).not.toHaveClass('ng-hide');
        expect(activationForm[inputName].getErrorLabelForRule(violatedRule)).toExist();
    }

    function expectNoValidationError(inputName) {
        expect(activationForm[inputName].getLabelContainer()).not.toHaveClass('error');
        expect(activationForm[inputName].getLabel()).not.toHaveClass('ng-hide');
        expect(activationForm[inputName].getErrorLabelsContainer()).toHaveClass('ng-hide');
    }

    function fillAndSubmitForm() {
        activationForm.password.getInputField().val('secret!!!').trigger('input');
        activationForm.repeatedPassword.getInputField().val('secret!!!').trigger('input');

        activationForm.getSubmitButton().click();
    }

    function expectBackendActivationCallAndRespond(statusCode, responseBody) {
        $httpBackend.expectPOST('/user/test@crowd.source.de/activation', {
            "email": "test@crowd.source.de", // actually not needed, but will be ignored by the backend
            "password": "secret!!!",
            "repeatedPassword": "secret!!!", // actually not needed for the backend, but will be ignored by the backend
            "activationToken": "12345"
        })
            .respond(statusCode, responseBody);
    }

    function expectBackendLoginCallAndRespond(statusCode, responseBody) {
        $httpBackend.expectPOST('/oauth/token', 'username=test%40crowd.source.de&password=secret!!!&client_id=web&grant_type=password')
            .respond(statusCode, responseBody);
    }


    it('should show no validation errors when the form is untouched', function () {
        compileView();

        expect(activationForm.getGeneralErrorsContainer()).not.toExist();

        expectNoValidationError('password');
        expectNoValidationError('repeatedPassword');
    });

    it('should show no validation errors when the form is filled correctly', function () {
        compileView();

        activationForm.password.getInputField().val('secret!!!').trigger('input');
        activationForm.repeatedPassword.getInputField().val('secret!!!').trigger('input');

        expect(activationForm.getGeneralErrorsContainer()).not.toExist();

        expectNoValidationError('password');
        expectNoValidationError('repeatedPassword');
    });

    it('should POST the data to the server, request an access token and redirect to index page', function () {
        compileView();

        expectBackendActivationCallAndRespond(201);
        expectBackendLoginCallAndRespond(200);
        $httpBackend.expectGET('/user/current').respond(200, {});

        fillAndSubmitForm();
        $httpBackend.flush();

        expect($location.path()).toBe('/');
    });

    it('should disable the submit button and change it\'s text while loading', function () {
        compileView();

        expectBackendActivationCallAndRespond(201);
        expectBackendLoginCallAndRespond(200);
        $httpBackend.expectGET('/user/current').respond(200, {});

        expect(activationForm.getSubmitButton()).toHaveText('Speichern');
        expect(activationForm.getSubmitButton()).not.toBeDisabled();

        fillAndSubmitForm();

        expect(activationForm.getSubmitButton()).toHaveText('Speichern...');
        expect(activationForm.getSubmitButton()).toBeDisabled();

        $httpBackend.flush();

        expect(activationForm.getSubmitButton()).toHaveText('Speichern');
        expect(activationForm.getSubmitButton()).not.toBeDisabled();
    });

    it('should show an unknown error when the activation call results in 500', function () {
        compileView();

        expectBackendActivationCallAndRespond(500);
        spyOn($location, 'path');

        fillAndSubmitForm();
        $httpBackend.flush();
        expect(activationForm.getGeneralErrorsContainer()).toExist();
        expect(activationForm.getGeneralError('remote_unknown')).toExist();

        expect($location.path).not.toHaveBeenCalled();
    });

    it('should show an unknown error when the token call results in 500', function () {
        compileView();

        expectBackendActivationCallAndRespond(201);
        expectBackendLoginCallAndRespond(500);
        spyOn($location, 'path');

        fillAndSubmitForm();
        $httpBackend.flush();
        expect(activationForm.getGeneralErrorsContainer()).toExist();
        expect(activationForm.getGeneralError('remote_unknown')).toExist();

        expect($location.path).not.toHaveBeenCalled();
    });

    it('should show "required" validation errors when the form is submitted without touching the input fields', function () {
        compileView();


        activationForm.getSubmitButton().click();

        expectValidationError('password', 'required');
        expectValidationError('repeatedPassword', 'required');
    });

    it('should show a validation error if the password is changed to blank', function () {
        compileView();

        activationForm.password.getInputField().val('secret!!!').trigger('input');
        activationForm.password.getInputField().val('').trigger('input');

        expectValidationError('password', 'required');
    });

    it('should show a validation error if the repeated password is changed to blank', function () {
        compileView();

        activationForm.repeatedPassword.getInputField().val('secret!!!').trigger('input');
        activationForm.repeatedPassword.getInputField().val('').trigger('input');

        expectValidationError('repeatedPassword', 'required');
    });

    it('should show a validation error if the password is too short', function () {
        compileView();

        activationForm.password.getInputField().val('123456').trigger('input');
        expectValidationError('password', 'pattern');
    });

    it('should show a validation error if the password has no special characters', function () {
        compileView();

        activationForm.password.getInputField().val('12345678').trigger('input');
        expectValidationError('password', 'pattern');
    });

    it('should show a validation error if the password contains whitespaces', function () {
        compileView();

        activationForm.password.getInputField().val('12345 67!').trigger('input');
        expectValidationError('password', 'pattern');
    });

    it('should show a validation error if the password contains whitespaces at the beginning', function () {
        compileView();

        activationForm.password.getInputField().val(' 1234567!').trigger('input');
        expectValidationError('password', 'pattern');
    });

    it('should show a validation error if the password contains whitespaces at the end', function () {
        compileView();

        activationForm.password.getInputField().val('1234567! ').trigger('input');
        expectValidationError('password', 'pattern');
    });

    it('should show a validation error if different passwords are entered once the form is submitted', function () {
        compileView();

        activationForm.password.getInputField().val('secure!!!').trigger('input');
        activationForm.repeatedPassword.getInputField().val('something else').trigger('input');

        expectNoValidationError('repeatedPassword');

        activationForm.getSubmitButton().click();

        expectValidationError('repeatedPassword', 'remote_equal');
    });

    it('should show an appropriate error message if the server responds with "already_activated"', function () {
        compileView();

        expectBackendActivationCallAndRespond(400, {"errorCode": "already_activated"});

        fillAndSubmitForm();
        $httpBackend.flush();

        expect(activationForm.getGeneralErrorsContainer()).toExist();
        expect(activationForm.getGeneralError('remote_already_activated')).toHaveText('Dein Konto wurde bereits aktiviert. ' +
            'Du kannst Dich mit Deiner Email-Adresse und Deinem Passwort einloggen.');
    });

    it('should show an appropriate error message if the server responds with "already_activated"', function () {
        spyOn($location, 'path').and.returnValue('/login/password-recovery/abc@def.ghi/activation/yzz');

        compileView();

        expectBackendActivationCallAndRespond(400, {"errorCode": "already_activated"});

        fillAndSubmitForm();
        $httpBackend.flush();

        expect(activationForm.getGeneralErrorsContainer()).toExist();
        expect(activationForm.getGeneralError('remote_already_activated')).toHaveText('Du hast dein Passwort bereits mit dem Link aus deiner E-Mail neu gesetzt. Du kannst die Passwort vergessen Funktion erneut benutzen, um einen neuen Link zugesendet zu bekommen.');
    });

    it('should show an appropriate error message if the server responds with "activation_token_invalid"', function () {
        compileView();

        expectBackendActivationCallAndRespond(400, {"errorCode": "activation_token_invalid"});

        fillAndSubmitForm();
        $httpBackend.flush();

        expect(activationForm.getGeneralErrorsContainer()).toExist();
        expect(activationForm.getGeneralError('remote_activation_token_invalid')).toExist();
    });

    it('should show an appropriate error message if the server responds with 404', function () {
        compileView();

        expectBackendActivationCallAndRespond(404);

        fillAndSubmitForm();
        $httpBackend.flush();

        expect(activationForm.getGeneralErrorsContainer()).toExist();
        expect(activationForm.getGeneralError('remote_not_found')).toExist();
    });

    it('should clear the remote_equal validation error once the user starts typing again', function () {
        compileView();

        activationForm.password.getInputField().val('secret!!!').trigger('input');
        activationForm.repeatedPassword.getInputField().val('something else!').trigger('input');

        activationForm.getSubmitButton().click();

        activationForm.repeatedPassword.getInputField().val('secret!!!').trigger('input');

        expectNoValidationError('repeatedPassword');
    });

    it('should display the right text if the view is used in the registration flow', function () {
        compileView();

        expect(activationForm.getHeadline()).toHaveText('Registrierung - letzte Schritte');
        expect(activationForm.getInformationText()).toHaveText('Bitte vergib ein Passwort, um die Aktivierung Deines Kontos abzuschließen.');
    });

    it('should display the right text if the view is used in the registration flow', function () {
        spyOn($location, 'path').and.returnValue('/login/password-recovery/abc@def.ghi/activation/yzz');

        compileView();

        expect(activationForm.getHeadline()).toHaveText('Passwort neu setzen');
        expect(activationForm.getInformationText()).toHaveText('Bitte vergib jetzt ein neues Passwort.');
    });
});
