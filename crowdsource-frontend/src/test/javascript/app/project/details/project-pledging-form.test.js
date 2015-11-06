describe('project pledging form', function () {

    var $scope, $compile, $httpBackend, AuthenticationToken;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset

        inject(function ($rootScope, _$compile_, _$httpBackend_, _AuthenticationToken_) {
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            AuthenticationToken = _AuthenticationToken_;
        });
    });

    function compileDirective() {
        var root = $compile('<project-pledging-form project="project"></project-pledging-form>')($scope);
        $scope.$digest();
        return {
            root: root,
            slider: root.find('.range-slider'),
            pledgeAmount: new FormGroup(root.find('.form-controls-amount')),
            pledgableAmount: root.find('.pledgable-amount'),
            pledgeButton: root.find('button'),
            pledgedAmount: root.find('.pledged-amount'),
            pledgeGoal: root.find('.pledge-goal'),
            budget: root.find('.budget'),
            notification: root.find('.notification')
        };
    }

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

    function prepareMocks(data) {
        $scope.project = data.project;
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(data.isLoggedIn);
        $httpBackend.expectGET('/financinground/active').respond(data.financingRoundResponse.statusCode, data.financingRoundResponse.body);
        $httpBackend.expectGET('/user/current').respond(data.userResponse.statusCode, data.userResponse.body);
    }

    function getGeneralError(elements, errorCode) {
        return elements.root.find('[ng-message="' + errorCode + '"]');
    }

    function expectFormValueInitialized(expectedFormValue, runs) {
        waitsForAndRuns(
            function() {
                return $scope.project.$resolved;
            },
            function () {
                expect(elements.pledgeAmount.getInputField()).toHaveValue(expectedFormValue);
                if (typeof runs === 'function') {
                    runs();
                }
            },
            1000,
            true
        );
    }

    it("should add a pledge", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 60, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        // type in 30
        elements.pledgeAmount.getInputField().val('30').trigger('input');

        // expect everything to have changed
        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).not.toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
        expect(elements.notification).toHaveClass('ng-hide');
        expect(elements.pledgedAmount).toHaveText('90');
        expect(elements.pledgeGoal).toHaveText('100');
        expect(elements.budget).toHaveText('170 €');
        expect(elements.pledgableAmount).toHaveText('40 €');

        // prepare for backend calls
        $httpBackend.expectPOST('/project/123/pledges', {amount: 30}).respond(200);
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 100, pledgedAmount: 90, status: 'PUBLISHED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 170});
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Bitte warten...');
        $httpBackend.flush();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Deine Finanzierung war erfolgreich.');
        expect(elements.pledgeAmount.getInputField()).toHaveValue("0");
        expect(elements.pledgedAmount).toHaveText('90');
        expect(elements.pledgeGoal).toHaveText('100');
        expect(elements.budget).toHaveText('170 €');
        expect(elements.pledgableAmount).toHaveText('10 €');

        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
        expect(elements.root.find('.general-error')).not.toExist();
    });

    it("should show a different text when the project was fully pledged", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 60, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        // type in 30
        elements.pledgeAmount.getInputField().val('40').trigger('input');

        // prepare for backend calls
        $httpBackend.expectPOST('/project/123/pledges', {amount: 40}).respond(200);
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 100, pledgedAmount: 100, status: 'FULLY_PLEDGED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 160});
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();
        $httpBackend.flush();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification.text().trim()).toBe('Deine Finanzierung war erfolgreich. Das Projekt ist jetzt zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.');
        expect(elements.pledgeAmount.getInputField()).toHaveValue("0");
        expect(elements.pledgedAmount).toHaveText('100');
        expect(elements.pledgeGoal).toHaveText('100');
        expect(elements.budget).toHaveText('160 €');
        expect(elements.pledgableAmount).toHaveText('0 €');

        expect(elements.slider).toHaveClass('disabled');
        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
        expect(elements.root.find('.general-error')).not.toExist();
    });


    it("should disable the form until the user budget is loaded", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 20}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();

        expect(elements.notification).toHaveClass('ng-hide');
        expect(elements.slider).toHaveClass('disabled');
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);

        $httpBackend.flush();

        expect(elements.notification).toHaveClass('ng-hide');
        expect(elements.slider).not.toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).not.toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);
    });

    it("should disable the form until the project details are loaded", function () {

        prepareMocks({
            project: {$resolved: false},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 20}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);

        angular.copy({$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 50, status: 'PUBLISHED'}, $scope.project);
        $scope.$digest();

        expect(elements.slider).not.toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).not.toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);
    });

    it("should disable the form if the user has no budget", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();
        expect(elements.pledgableAmount).toHaveText('0 €');
        expect(elements.budget).toHaveText('0 €');
        expectNoValidationError(elements.pledgeAmount);
    });

    it("should disable the form if the user is not logged in", function () {

        $scope.project = {$resolved: true, pledgeGoal: 100, pledgedAmount: 50, status: 'PUBLISHED'};
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(false);
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        var elements = compileDirective();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);
    });

    it("should show no validation error message and disable button if zero pledge is is entered and user has NOT pledged before", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 50, pledgedAmountByRequestingUser: 0, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 100}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        elements.pledgeAmount.getInputField().val('').trigger('input').val('0').trigger('input');

        expectNoValidationError(elements.pledgeAmount);

        expect(elements.pledgeButton).toBeDisabled();
    });


    it("should show no validation error message and enable button if zero pledge is is entered and user has pledged before", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 50, pledgedAmountByRequestingUser: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 100}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        elements.pledgeAmount.getInputField().val('').trigger('input').val('0').trigger('input');

        expectNoValidationError(elements.pledgeAmount);

        expect(elements.pledgeButton).not.toBeDisabled();
    });


    it("should show a validation error message if the entered pledge amount exceeds the pledge goal", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        elements.pledgeAmount.getInputField().val('51').trigger('input');
        expectValidationError(elements.pledgeAmount, 'max');
        expect(elements.pledgeButton).toBeDisabled();
    });

    it("should show a validation error message if the entered pledge amount exceeds the user budget", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        elements.pledgeAmount.getInputField().val('201').trigger('input');
        expectValidationError(elements.pledgeAmount, 'max');
        expect(elements.pledgeButton).toBeDisabled();
    });

    it("should show a validation error message if the entered pledge amount is no even number", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        elements.pledgeAmount.getInputField().val('1.2').trigger('input');
        expectValidationError(elements.pledgeAmount, 'pattern');
        expect(elements.pledgeButton).toBeDisabled();
    });

    it("should recover from a over-pledge", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        // type in 30
        elements.pledgeAmount.getInputField().val('30').trigger('input');

        // prepare for backend call
        $httpBackend.expectPOST('/project/123/pledges', {amount: 30}).respond(400, {errorCode: 'pledge_goal_exceeded'});
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 500, pledgedAmount: 480, status: 'PUBLISHED'}); // the pledged amount is 480 now!
        $httpBackend.expectGET('/user/current').respond(200, {budget: 200});
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();

        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Bitte warten...');

        $httpBackend.flush();

        // expect form to be updated with the new values from backend
        expect(elements.notification).toHaveClass('ng-hide');
        expect(elements.pledgeAmount.getInputField()).toHaveValue("0");
        expect(elements.pledgedAmount).toHaveText('480');
        expect(elements.pledgeGoal).toHaveText('500');
        expect(elements.budget).toHaveText('200 €');
        expect(elements.pledgableAmount).toHaveText('20 €');

        expect(elements.root.find('.general-error')).toExist();
        expect(getGeneralError(elements, 'remote_pledge_goal_exceeded')).toExist();
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');

        // retry with 20
        elements.pledgeAmount.getInputField().val('10').trigger('input');

        expect(elements.pledgeButton).not.toBeDisabled();

        // prepare for backend calls
        $httpBackend.expectPOST('/project/123/pledges', {amount: 10}).respond(200);
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 500, pledgedAmount: 490, status: 'PUBLISHED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 190});
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();

        expect(elements.root.find('.general-error')).not.toExist();
        expect(getGeneralError(elements, 'remote_pledge_goal_exceeded')).not.toExist();
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Bitte warten...');

        $httpBackend.flush();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Deine Finanzierung war erfolgreich.');
        expect(elements.pledgeAmount.getInputField()).toHaveValue("0");
        expect(elements.pledgedAmount).toHaveText('490');
        expect(elements.pledgeGoal).toHaveText('500');
        expect(elements.budget).toHaveText('190 €');
        expect(elements.pledgableAmount).toHaveText('10 €');

        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
    });

    it("should show an error message when the financing round ended in the meantime", function () {
        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 190}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        $httpBackend.expectPOST('/project/123/pledges', {amount: 30}).respond(400, {errorCode: 'no_financing_round_currently_active'});
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 500, pledgedAmount: 50});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 190});
        $httpBackend.expectGET('/financinground/active').respond(404);

        elements.pledgeAmount.getInputField().val('30').trigger('input');
        elements.pledgeButton.click();

        $httpBackend.flush();

        expect(elements.root.find('.general-error')).toExist();
        expect(getGeneralError(elements, 'remote_no_financing_round_currently_active')).toExist();
        expect(elements.notification).toHaveClass('ng-hide');
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();
        expect(elements.slider).toHaveClass('disabled');
    });

    it("should show a message saying that the user has no budget anymore", function () {
        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Dein Budget ist leider aufgebraucht. Du kannst dieses Projekt nicht weiter finanzieren. Bitte warte ab, bis die nächste Finanzierungsrunde startet, dann wird der Finanzierungstopf erneut auf alle Benutzer aufgeteilt.');
    });

    it("should show a message saying that the user is not logged in", function () {

        $scope.project = {$resolved: true, pledgeGoal: 100, pledgedAmount: 50, status: 'PUBLISHED'};
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(false);
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Bitte logge dich ein, um Projekte finanziell zu unterstützen.');
    });

    it("should show a message saying that the project is fully pledged", function () {

        $scope.project = {$resolved: true, pledgeGoal: 100, pledgedAmount: 50, status: 'FULLY_PLEDGED'};
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(false);
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Das Projekt ist zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.');
    });

    it("should show a message saying that the project is not published", function () {

        $scope.project = {$resolved: true, pledgeGoal: 100, pledgedAmount: 50, status: 'PROPOSED'};
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(false);
        $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification.text().trim()).toBe('Eine Finanzierung ist erst möglich, wenn das Projekt von einem Administrator veröffentlicht wurde.');
    });

    it("should show a message saying that there is no financing round active", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0}},
            financingRoundResponse: {statusCode: 404}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Momentan läuft keine Finanzierungsrunde. Bitte versuche es nochmal, wenn die Finanzierungsrunde gestartet worden ist.');
    });

    it("should initialize slider with amount already pledged by the current user", function () {
        prepareMocks({
            project: {$resolved: false, id: 123, pledgeGoal: 100, pledgedAmount: 80, pledgedAmountByRequestingUser : 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 20}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });
        var elements = compileDirective();
        $httpBackend.flush();
        $scope.project.$resolved = true;

        expectFormValueInitialized(50);
        expectNoValidationError(elements.pledgeAmount);
    });



    it("should reduce an already taken pledge", function () {
        prepareMocks({
            project: {$resolved: false, id: 123, pledgeGoal: 100, pledgedAmount: 80, pledgedAmountByRequestingUser: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 200}},
            financingRoundResponse: {statusCode: 200, body: {active: true}}
        });

        var elements = compileDirective();
        $httpBackend.flush();
        $scope.project.$resolved = true;

        function runs () {
            expect(elements.pledgeButton).toBeDisabled();
            expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
            expect(elements.notification).toHaveClass('ng-hide');
            expect(elements.pledgedAmount).toHaveText('50');
            expect(elements.pledgeGoal).toHaveText('100');
            expect(elements.budget).toHaveText('200 €');
            expect(elements.pledgableAmount).toHaveText('20 €');

            // type in 10
            elements.pledgeAmount.getInputField().val('10').trigger('input');

            // expect everything to have changed
            expectNoValidationError(elements.pledgeAmount);
            expect(elements.pledgeButton).not.toBeDisabled();
            expect(elements.pledgeButton).toHaveText('Jetzt Budget abziehen');
            expect(elements.notification).toHaveClass('ng-hide');
            expect(elements.pledgedAmount).toHaveText('40');
            expect(elements.pledgeGoal).toHaveText('100');
            expect(elements.budget).toHaveText('240 €');
            expect(elements.pledgableAmount).toHaveText('60 €');

            // prepare for backend calls
            $httpBackend.expectPOST('/project/123/pledges', {amount: -40}).respond(200);
            $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 100, pledgedAmount: 40, status: 'PUBLISHED'});
            $httpBackend.expectGET('/user/current').respond(200, {budget: 240});
            $httpBackend.expectGET('/financinground/active').respond(200, {active: true});

            // submit form
            elements.pledgeButton.click();
            expect(elements.pledgeButton).toBeDisabled();
            expect(elements.pledgeButton).toHaveText('Bitte warten...');
            $scope.project.$resolved = false;
            $httpBackend.flush();
            $scope.project.$resolved = true;

            // expect form to be in pristine state and with new values
            expect(elements.notification).not.toHaveClass('ng-hide');
            expect(elements.notification).toHaveText('Budget erfolgreich aus dem Projekt abgezogen.');
            expect(elements.pledgeAmount.getInputField()).toHaveValue("0");
            expect(elements.pledgedAmount).toHaveText('40');
            expect(elements.pledgeGoal).toHaveText('100');
            expect(elements.budget).toHaveText('240 €');
            expect(elements.pledgableAmount).toHaveText('60 €');

            expectNoValidationError(elements.pledgeAmount);
            expect(elements.pledgeButton).toBeDisabled();
            expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
            expect(elements.root.find('.general-error')).not.toExist();
        }

        expectFormValueInitialized(50, runs);
        expectNoValidationError(elements.pledgeAmount);

    });

    //it("should not show error when user completely revokes an already taken pledge", function () {
    //
    //    prepareMocks({
    //        project: {$resolved: true, id: 123, pledgeGoal: 100, pledgedAmount: 80, pledgedAmountByRequestingUser: 50, status: 'PUBLISHED'},
    //        isLoggedIn: true,
    //        userResponse: {statusCode: 200, body: {budget: 200}},
    //        financingRoundResponse: {statusCode: 200, body: {active: true}}
    //    });
    //
    //    var elements = compileDirective();
    //    $httpBackend.flush();
    //
    //    expect(elements.slider).toHaveData('currentReal', 50);
    //    expect(elements.pledgeAmount.getInputField()).toHaveValue('50');
    //    expectNoValidationError(elements.pledgeAmount);
    //
    //    // type in 0 - completely remove pledge from this project
    //    elements.pledgeAmount.getInputField().val('0').trigger('input');
    //
    //    // expect everything to have changed
    //    // TODO: doesn't work right now. :-/
    //    expectNoValidationError(elements.pledgeAmount);
    //    expect(elements.pledgeButton).not.toBeDisabled();
    //    expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
    //    expect(elements.notification).toHaveClass('ng-hide');
    //});

});
