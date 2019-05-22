describe('financing rounds', function () {

    var $scope, $httpBackend, $window, $location, financingRounds, view;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset
        mockTranslation();

        inject(function ($compile, $rootScope, _$window_, $templateCache, $controller, _$location_, _$httpBackend_, FinancingRound) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $window = _$window_;
            $location = _$location_;

            $controller('FinancingRoundsController as financingRounds', {
                $scope: $scope,
                $location: $location,
                $routeParams: {
                    projectId: 'xyz'
                },
                FinancingRound: FinancingRound
            });

            var template = $templateCache.get('app/financing-rounds/financing-rounds.html');
            view = $compile(template)($scope);

            financingRounds = new FinancingRounds(view);
        });
    });


    it("should display correct elements when no round is present", function () {
        prepareViewWithNoRunningRound();

        expect(financingRounds.getTableStartDate()).not.toExist();
        expect(financingRounds.getTableEndDate()).not.toExist();
        expect(financingRounds.getTableBudget()).not.toExist();
        expect(financingRounds.getTableEndRoundButton()).not.toExist();
        expect(financingRounds.getStartRoundButton()).toBeDisabled();
        expect(financingRounds.getNotification()).not.toExist();
        expect(financingRounds.getEndDate().getInputField()).toHaveProp('placeholder', 'Bitte klicken...');
        expect(financingRounds.getBudget().getInputField()).toHaveProp('placeholder', '0');
        expect(financingRounds.getTableText()).toContainText('Es wurde noch keine Finanzierungsrunde gestartet');
    });


    it("should display correct elements when active round is present", function () {
        var startDate = moment();
        var endDate = startDate.add(5, 'days');

        prepareBackendGetFinancingRoundsMock([
            {"id": "4711", "budget": "5555", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "active": true}
        ]);
        $httpBackend.flush();
        $scope.$digest();

        expect(financingRounds.getTableRowCount()).toBe(1);
        expect(financingRounds.getTableStartDate()).toHaveText(startDate.format('DD.MM.YY HH:mm'));
        expect(financingRounds.getTableEndDate()).toHaveText(endDate.format('DD.MM.YY HH:mm'));
        expect(financingRounds.getTableBudget()).toHaveText('5.555');
        expect(financingRounds.getTableEndRoundButton()).not.toBeDisabled();
        expect(financingRounds.getStartRoundButton()).not.toExist();
        expect(financingRounds.getNotification()).toContainText('Es läuft bereits eine Finanzierungsrunde. Daher kann keine neue Runde gestartet werden.');
    });

    it("should display two finished rounds", function () {
        var now = moment();
        var startDate1 = now.clone().subtract(10, 'days');
        var endDate1 = startDate1.clone().add(5, 'days');
        var startDate2 = now.clone().subtract(20, 'days');
        var endDate2 = startDate2.clone().add(5, 'days');

        var row_0 = '.row-0';
        var row_1 = '.row-1';

        prepareBackendGetFinancingRoundsMock([
            {"budget": "1111", "startDate": startDate1.toISOString(), "endDate": endDate1.toISOString(), "active": false},
            {"budget": "2222", "postRoundBudget": 1001, "startDate": startDate2.toISOString(), "endDate": endDate2.toISOString(), "active": false}
        ]);
        $httpBackend.flush();
        $scope.$digest();

        financingRounds = new FinancingRounds(view);

        expect(financingRounds.getTableRowCount()).toBe(2);

        expect(financingRounds.getTableStartDate(row_0).text()).toBe(startDate1.format('DD.MM.YY HH:mm'));
        expect(financingRounds.getTableEndDate(row_0).text()).toBe(endDate1.format('DD.MM.YY HH:mm'));
        expect(financingRounds.getTableBudget(row_0).text()).toBe('1.111');

        expect(financingRounds.getTableStartDate(row_1).text()).toBe(startDate2.format('DD.MM.YY HH:mm'));
        expect(financingRounds.getTableEndDate(row_1)).toHaveText(endDate2.format('DD.MM.YY HH:mm'));
        expect(financingRounds.getTableBudget(row_1)).toHaveText('2.222');
        expect(financingRounds.getTablePostRoundBudget(row_1)).toHaveText('1.001');

        expect(financingRounds.getTableEndRoundButton(row_0)).not.toExist();
        expect(financingRounds.getTableEndRoundButton(row_1)).not.toExist();

        expect(financingRounds.getStartRoundButton()).toExist();
        expect(financingRounds.getNotification()).not.toContainText('Es läuft bereits eine Finanzierungsrunde. Daher kann keine neue Runde gestartet werden.');
    });

    it("should display two rounds where one of them is active", function () {
        var now = moment();
        var startDate1 = now.clone().subtract(10, 'days');
        var endDate1 = now.clone().add(5, 'days');
        var startDate2 = now.clone().subtract(20, 'days');
        var endDate2 = startDate2.clone().add(10, 'days');

        var row = '.row-1';

        prepareBackendGetFinancingRoundsMock([
            {"budget": "1111", "startDate": startDate1.toISOString(), "endDate": endDate1.toISOString(), "active": true},
            {"budget": "2222", "startDate": startDate2.toISOString(), "endDate": endDate2.toISOString(), "active": false}
        ]);

        $httpBackend.flush();
        $scope.$digest();

        expect(financingRounds.getTableRowCount()).toBe(2);
        expect(financingRounds.getTableEndRoundButton()).toExist();
        expect(financingRounds.getTableEndRoundButton(row)).not.toExist();

        expect(financingRounds.getStartRoundButton()).not.toExist();
        expect(financingRounds.getNotification()).toContainText('Es läuft bereits eine Finanzierungsrunde. Daher kann keine neue Runde gestartet werden.');
    });

    it("should display budget input field error messages when wrong data is given", function () {
        prepareViewWithNoRunningRound();

        financingRounds.getBudget().getInputField().val('1.23').trigger('input');
        expectBudgetValidationError('pattern');

        financingRounds.getBudget().getInputField().val('0').trigger('input');
        expectBudgetValidationError('min');

        financingRounds.getBudget().getInputField().val('').trigger('input');
        expectBudgetValidationError('required');
    });

    it("should send round data to backend and display it when valid data is submitted", function () {
        var startDate = moment().tz('Europe/Berlin');
        var endDate = startDate.add(5, 'days');
        var budget = 320;

        var modifiedEndDate = endDate.hour(23);
        modifiedEndDate = modifiedEndDate.minute(59);
        modifiedEndDate = modifiedEndDate.second(59);
        modifiedEndDate = modifiedEndDate.millisecond(0);

        prepareViewWithNoRunningRound();

        expect(financingRounds.getStartRoundButton()).toBeDisabled();

        financingRounds.getEndDate().getInputField().val(endDate.format('DD.MM.YYYY')).trigger('input');
        financingRounds.getBudget().getInputField().val('320').trigger('input');
        expect(financingRounds.getStartRoundButton()).not.toBeDisabled();

        $httpBackend.expectPOST('/financingrounds', {"budget": budget, "endDate": endDate.toISOString()}).respond(200,
            {"id": "4711", "startDate": startDate.toISOString(), "endDate": modifiedEndDate.toISOString(), "budget": budget, "active": true});

        $httpBackend.expectGET('/financingrounds').respond(200, [
            {"budget": "5555", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "active": true}
        ]);

        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: true});

        financingRounds.getStartRoundButton().click();
        expect(financingRounds.getStartRoundButton()).toHaveText('Starten...');
        $httpBackend.flush();
        expect(financingRounds.getAlertBox()).toContainText('Finanzierungsrunde gestartet.');
        expect(financingRounds.getStartRoundButton()).not.toExist();
    });

    it("should stop running round when stop is confirmed", function () {
        var startDate = moment().tz('Europe/Berlin');
        var endDate = startDate.add(5, 'days');

        prepareBackendGetFinancingRoundsMock([
            {"id": "4711", "budget": "5555", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "active": true}
        ]);

        $httpBackend.flush();
        $scope.$digest();

        expect(financingRounds.getTableEndRoundButton()).toHaveText('Beenden');

        $httpBackend.expectPUT('/financingrounds/4711/cancel', {})
            .respond(200, {"id": "4711", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "budget": 4444, "active": false});

        prepareBackendGetFinancingRoundsMock([
            {"id": "4711", "budget": "5555", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "active": false}
        ]);

        $httpBackend.expectGET('/financingrounds/mostRecent').respond(200, {active: false});

        spyOn($window, 'confirm').and.returnValue(true);
        financingRounds.getTableEndRoundButton().click();

        expect(financingRounds.getTableEndRoundButton()).toHaveText('Beenden...');
        $httpBackend.flush();

        expect(financingRounds.getAlertBox()).toContainText('Finanzierungsrunde gestoppt.');
        expect(financingRounds.getTableEndRoundButton()).not.toExist();
    });

    it("should not stop running round when stop is canceled", function () {
        var startDate = moment().tz('Europe/Berlin');
        var endDate = startDate.add(5, 'days');

        prepareBackendGetFinancingRoundsMock([
            {"id": "4711", "budget": "5555", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "active": true}
        ]);

        $httpBackend.flush();
        $scope.$digest();

        spyOn($window, 'confirm').and.returnValue(false);
        financingRounds.getTableEndRoundButton().click();
    });

    it("should display alert message when backend not responding on round start", function () {
        var startDate = moment().tz('Europe/Berlin');
        var endDate = startDate.add(5, 'days');
        var budget = 320;

        var modifiedEndDate = endDate.hour(23);
        modifiedEndDate = modifiedEndDate.minute(59);
        modifiedEndDate = modifiedEndDate.second(59);
        modifiedEndDate = modifiedEndDate.millisecond(0);

        prepareViewWithNoRunningRound();

        $httpBackend.expectPOST('/financingrounds', {"budget": budget, "endDate": modifiedEndDate.toISOString()}).respond(500);
        expect(financingRounds.getStartRoundButton()).toBeDisabled();

        financingRounds.getEndDate().getInputField().val(endDate.format('DD.MM.YYYY')).trigger('input');
        financingRounds.getBudget().getInputField().val('320').trigger('input');
        expect(financingRounds.getStartRoundButton()).not.toBeDisabled();

        financingRounds.getStartRoundButton().click();
        $httpBackend.flush();
        expect(financingRounds.getAlertBox()).toContainText('Fehler beim Starten der Finanzierungsrunde!');
    });

    it("should display alert message when backend not responding on round end", function () {
        var startDate = moment().tz('Europe/Berlin');
        var endDate = startDate.add(5, 'days');

        prepareBackendGetFinancingRoundsMock([
            {"id": "4711", "budget": "5555", "startDate": startDate.toISOString(), "endDate": endDate.toISOString(), "active": true}
        ]);

        $httpBackend.flush();
        $scope.$digest();

        $httpBackend.expectPUT('/financingrounds/4711/cancel', {}).respond(500);

        spyOn($window, 'confirm').and.returnValue(true);
        financingRounds.getTableEndRoundButton().click();
        $httpBackend.flush();

        expect(financingRounds.getAlertBox()).toContainText('Fehler beim Stoppen der Finanzierungsrunde!');
    });

    it("should display alert message when backend not responding on get rounds", function () {
        $httpBackend.expectGET('/financingrounds').respond(500);
        $httpBackend.flush();
        $scope.$digest();

        expect(financingRounds.getAlertBox()).toContainText('Fehler beim Abrufen der Finanzierungsrunden');
    });

    function prepareViewWithNoRunningRound() {
        prepareBackendGetFinancingRoundsMock([]);

        $httpBackend.flush();
        $scope.$digest();
    }

    function prepareBackendGetFinancingRoundsMock(response) {
        $httpBackend.expectGET('/financingrounds').respond(200, response);
    }

    function expectBudgetValidationError(violatedRule) {
        expect(financingRounds.getBudget().getLabelContainer()).toHaveClass('error');
        expect(financingRounds.getBudget().getLabel()).toHaveClass('ng-hide');
        expect(financingRounds.getBudget().getErrorLabelsContainer()).not.toHaveClass('ng-hide');
        expect(financingRounds.getBudget().getErrorLabelForRule(violatedRule)).toExist();
    }
});