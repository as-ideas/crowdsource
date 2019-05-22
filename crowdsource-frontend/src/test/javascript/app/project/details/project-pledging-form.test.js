describe('project pledging form', function () {

    var $scope, $compile, $httpBackend, AuthenticationToken, FinancingRound, $timeout, root;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset
        mockTranslation();

        inject(function ($rootScope, _$compile_, _$httpBackend_, _AuthenticationToken_, _FinancingRound_, _$timeout_) {
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            AuthenticationToken = _AuthenticationToken_;
            FinancingRound = _FinancingRound_;
            $timeout = _$timeout_;
        });
    });

    function compileDirective() {
        root = $compile('<project-pledging-form project="project"></project-pledging-form>')($scope);
        $scope.$digest();
        return reloadViewAbstraction()
    }

    function reloadViewAbstraction(){
        return {
            root: root,
            slider: root.find('.range-slider'),
            pledgeAmount: new FormGroup(root.find('.form-controls-amount')),
            pledgableAmount: root.find('.pledgable-amount'),
            pledgeButton: root.find('button'),
            pledgedAmount: root.find('.pledged-amount'),
            pledgeGoal: root.find('.pledge-goal'),
            budget: root.find('.budget'),
            notification: root.find('.notification'),
            pledgedAmtStatic : root.find('.pledged-amt-static'),
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
        if(!data.financingRoundResponse.body){
            $httpBackend.expectGET('/financingrounds/mostRecent').respond(data.financingRoundResponse.statusCode);
        }else{
            $httpBackend.expectGET('/financingrounds/mostRecent').respond(data.financingRoundResponse.body);
        }
        $httpBackend.expectGET('/user/current').respond(data.userResponse.statusCode, data.userResponse.body);
    }

    function getGeneralError(elements, errorCode) {
        return elements.root.find('[ng-message="' + errorCode + '"]');
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
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 100, pledgedAmount: 90, pledgedAmountByRequestingUser: 30, status: 'PUBLISHED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 170});
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Bitte warten...');
        $httpBackend.flush();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Deine Finanzierung war erfolgreich.');
        expect(elements.pledgeAmount.getInputField()).toHaveValue("30");
        expect(elements.pledgedAmount).toHaveText('90');
        expect(elements.pledgeGoal).toHaveText('100');
        expect(elements.budget).toHaveText('170 €');
        expect(elements.pledgableAmount).toHaveText('40 €');

        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
        expect(elements.root.find('.general-error')).not.toExist();
    });

    it("should allow pledging for admin user when financing round is finished but post round pledging possible", function () {
        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0, roles: ['ROLE_USER', 'ROLE_ADMIN']} },
            financingRoundResponse: {statusCode: 200, body: {
                $resolved : true,
                active: false,
                postRoundBudgetDistributable: true,
                postRoundBudget: 1000,
                postRoundBudgetRemaining: 800
            }}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        elements.pledgeAmount.getInputField().val('30').trigger('input');

        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).not.toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');

        expect(elements.notification.text().trim()).toBe('Momentan läuft keine Finanzierungsrunde. Du bist als Admin jedoch berechtigt aus dem restlichen Budget der Finanzierungsrunde weitere Investments zu tätigen.');
        expect(elements.pledgedAmount).toHaveText('80');
        expect(elements.pledgeGoal).toHaveText('500');
        expect(elements.budget).toHaveText('770 €');
        expect(elements.pledgableAmount).toHaveText('450 €');
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
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 100, pledgedAmount: 100, pledgedAmountByRequestingUser: 40, status: 'FULLY_PLEDGED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 160});
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();
        $httpBackend.flush();
        $timeout.flush();

        elements = reloadViewAbstraction();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification.text().trim()).toBe('Deine Finanzierung war erfolgreich. Das Projekt ist jetzt zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.');
        expect(elements.pledgeAmount.getInputField()).not.toBeVisible();
        expect(elements.pledgedAmtStatic).toHaveText("40");

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
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        var elements = compileDirective();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();

        expectNoValidationError(elements.pledgeAmount);
    });

    it("should disable form for post round pledging until financing round is loaded", function () {

        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0, roles: ['ROLE_USER', 'ROLE_ADMIN']} },
            financingRoundResponse: { $resolved: false}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);

        angular.copy({
            $resolved : true,
            active: false,
            postRoundBudgetDistributable: true,
            postRoundBudget: 1000,
            postRoundBudgetRemaining: 800
        }, FinancingRound.currentFinancingRound());

        $scope.$digest();

        expect(elements.slider).not.toHaveClass('disabled');
        expect(elements.pledgeAmount.getInputField()).not.toBeDisabled();
        expectNoValidationError(elements.pledgeAmount);
    });

    it("should disable pledging form when post round pledging possible but user is not admin", function () {
        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 50, status: 'PUBLISHED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0, roles: ['ROLE_USER']} },
            financingRoundResponse: {statusCode: 200, body: {
                $resolved : true,
                active: false,
                postRoundBudgetDistributable: true,
                postRoundBudget: 1000,
                postRoundBudgetRemaining: 800
            }}
        });

        var elements = compileDirective();
        $httpBackend.flush();

        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Momentan läuft keine Finanzierungsrunde. Bitte versuche es nochmal, wenn die Finanzierungsrunde gestartet worden ist.');
    });

    it("should display correct financing and budget values when financing round terminated, project is fully pledged and user has pledged sth", function () {
        prepareMocks({
            project: {$resolved: true, id: 123, pledgeGoal: 500, pledgedAmount: 500, pledgedAmountByRequestingUser: 30, status: 'FULLY_PLEDGED'},
            isLoggedIn: true,
            userResponse: {statusCode: 200, body: {budget: 0, roles: ['ROLE_USER']} },
            financingRoundResponse: {statusCode: 200, body: {
                $resolved : true,
                active: false,
                postRoundBudgetDistributable: true,
                postRoundBudget: 1000,
                postRoundBudgetRemaining: 800
            }}
        });

        var elements = compileDirective();
        $httpBackend.flush();
        $timeout.flush();

        expectNoValidationError(elements.pledgeAmount);

        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText("Jetzt finanzieren");
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.pledgeAmount.getInputField()).not.toBeVisible();
        expect(elements.pledgedAmtStatic).toHaveText("30");
        expect(elements.pledgedAmount).toHaveText("500");
        expect(elements.pledgeGoal).toHaveText("500");
        expect(elements.budget).toHaveText("0 €");
        expect(elements.pledgableAmount).toHaveText("0 €");
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

    it("should recover from an over-pledge", function () {

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
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 500, pledgedAmount: 480, pledgedAmountByRequestingUser: 0, status: 'PUBLISHED'}); // the pledged amount is 480 now!
        $httpBackend.expectGET('/user/current').respond(200, {budget: 200});
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();

        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Bitte warten...');

        $httpBackend.flush();
        $timeout.flush();

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
        elements.pledgeAmount.getInputField().val('20').trigger('input');

        // prepare for backend calls
        $httpBackend.expectPOST('/project/123/pledges', {amount: 20}).respond(200);
        $httpBackend.expectGET('/project/123').respond(200, {id: 123, pledgeGoal: 500, pledgedAmount: 500, pledgedAmountByRequestingUser: 20, status: 'FULLY_PLEDGED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 180});
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        // submit form
        expect(elements.pledgeButton).not.toBeDisabled();
        elements.pledgeButton.click();

        $httpBackend.flush();
        $timeout.flush();
        elements = reloadViewAbstraction();

        expect(elements.root.find('.general-error')).not.toExist();
        expect(getGeneralError(elements, 'remote_pledge_goal_exceeded')).not.toExist();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Deine Finanzierung war erfolgreich. Das Projekt ist jetzt zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.');
        expect(elements.pledgeAmount.getInputField()).not.toBeVisible();
        expect(elements.pledgedAmtStatic).toHaveText("20");
        expect(elements.pledgedAmount).toHaveText('500');
        expect(elements.pledgeGoal).toHaveText('500');
        expect(elements.budget).toHaveText('180 €');
        expect(elements.pledgableAmount).toHaveText('0 €');

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
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: false});

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
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Bitte logge dich ein, um Projekte finanziell zu unterstützen.');
    });

    it("should show a message saying that the project is fully pledged", function () {

        $scope.project = {$resolved: true, pledgeGoal: 100, pledgedAmount: 50, status: 'FULLY_PLEDGED'};
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(false);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        var elements = compileDirective();
        $httpBackend.flush();

        expect(elements.slider).toHaveClass('disabled');
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Das Projekt ist zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.');
    });

    it("should show a message saying that the project is not published", function () {

        $scope.project = {$resolved: true, pledgeGoal: 100, pledgedAmount: 50, status: 'PROPOSED'};
        spyOn(AuthenticationToken, 'hasTokenSet').and.returnValue(false);
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

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

        expect(elements.pledgeAmount.getInputField()).toHaveValue("0");
        $scope.project.$resolved = true;
        $timeout.flush();

        expect(elements.pledgeAmount.getInputField()).toHaveValue("50");
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
        $timeout.flush();

        expect(elements.pledgeAmount.getInputField()).toHaveValue("50");
        expectNoValidationError(elements.pledgeAmount);

        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
        expect(elements.notification).toHaveClass('ng-hide');
        expect(elements.pledgedAmount).toHaveText('80');
        expect(elements.pledgeGoal).toHaveText('100');
        expect(elements.budget).toHaveText('200 €');
        expect(elements.pledgableAmount).toHaveText('70 €');

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
        expect(elements.pledgableAmount).toHaveText('70 €');

        // prepare for backend calls
        $httpBackend.expectPOST('/project/123/pledges', {amount: -40}).respond(200);
        $httpBackend.expectGET('/project/123').respond(200, {$resolved: false, id: 123, pledgeGoal: 100, pledgedAmount: 40, pledgedAmountByRequestingUser: 10, status: 'PUBLISHED'});
        $httpBackend.expectGET('/user/current').respond(200, {budget: 240});
        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        // submit form
        elements.pledgeButton.click();
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Bitte warten...');
        $scope.project.$resolved = false;
        $httpBackend.flush();
        $scope.project.$resolved = true;
        $timeout.flush();

        // expect form to be in pristine state and with new values
        expect(elements.notification).not.toHaveClass('ng-hide');
        expect(elements.notification).toHaveText('Budget erfolgreich aus dem Projekt abgezogen.');
        expect(elements.pledgeAmount.getInputField()).toHaveValue("10");
        expect(elements.pledgedAmount).toHaveText('40');
        expect(elements.pledgeGoal).toHaveText('100');
        expect(elements.budget).toHaveText('240 €');
        expect(elements.pledgableAmount).toHaveText('70 €');

        expectNoValidationError(elements.pledgeAmount);
        expect(elements.pledgeButton).toBeDisabled();
        expect(elements.pledgeButton).toHaveText('Jetzt finanzieren');
        expect(elements.root.find('.general-error')).not.toExist();
    });

    // TODO: Formularfelder bei fully pledged

    // TODO: Formularfelder bei mehreren pledgern.

});
