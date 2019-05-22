describe('teaser metrics service', function () {

    var $rootScope, $scope, $compile, $httpBackend, $interval, $timeout, Route, onRouteChangeSuccessListener;

    beforeEach(function () {
        module('crowdsource.templates');

        localStorage.clear();

        module('crowdsource', function ($provide) {
            $provide.decorator('Route', function ($delegate) {
                // callback mock
                $delegate.onRouteChangeSuccess = function (cb) {
                    onRouteChangeSuccessListener = cb;
                };

                // noop mock, will be spyed on later
                $delegate.getCurrentRoute = function () {
                };
                return $delegate;
            });
        });

        mockTranslation();

        inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$interval_, _$timeout_, _Route_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $interval = _$interval_;
            $timeout = _$timeout_;
            Route = _Route_;

            // freeze the time. All calls to new Date() return this time
            jasmine.clock().uninstall();
            jasmine.clock().mockDate(new Date('2015-01-21T15:04:23.003Z'));
            jasmine.clock().install();
        });
    });

    function renderDirective() {
        var root = $compile('<teaser></teaser>')($scope);
        $scope.$digest();

        return {
            root: root,
            container: root.find('> div'),
            remainingBudget: root.find('.test-remaining-budget'),
            remainingTime: root.find('.test-remaining-time'),
            userCount: root.find('.test-user-count'),
            submitButton: root.find('.teaser__btn')
        }
    }

    it("should show a slim teaser if the new route is configured to show no teaser", function () {
        currentRouteWantsTeaser(false);

        var teaser = renderDirective();
        expect(teaser.container).toHaveClass('teaser--slim');
    });

    it("should show the metrics retrieved from the backend", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'})
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-22T22:59:59.000Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();

        expect(teaser.remainingBudget.text()).toBe('');
        expect(teaser.remainingTime.text()).toBe('Noch  ');

        $httpBackend.flush();

        expect(teaser.container).toHaveClass('teaser--hero');
        expect(teaser.remainingBudget.text()).toBe('54.321');
        expect(teaser.remainingTime.text()).toBe('Noch 1d 7h 55m 35s');
        expect(teaser.userCount.text()).toBe('33');
    });

    it("should only render the directive once if the directive is initialized before the $routeChangeStart event fired", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 123, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-23T22:59:59.000Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        changeRoute({showTeaser: true});

        $httpBackend.flush();

        expect(teaser.container).toHaveClass('teaser--hero');
    });

    it("should count down the remaining time", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-22T22:59:59.000Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        $httpBackend.flush();

        expect(teaser.remainingTime.text()).toBe('Noch 1d 7h 55m 35s');

        elapseTime(1000);

        expect(teaser.remainingTime.text()).toBe('Noch 1d 7h 55m 34s');
    });

    it("should show the remaining time based on the server time", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:30.003Z'}); // server time is 7 seconds ahead
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-22T22:59:59.000Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        $httpBackend.flush();

        expect(teaser.remainingTime.text()).toBe('Noch 1d 7h 55m 28s'); // 7 seconds less than before

        elapseTime(1000);

        expect(teaser.remainingTime.text()).toBe('Noch 1d 7h 55m 27s');
    });

    it("should show a different information if no financing round is currently active", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:01:23.003Z'});
        expectFinancingRoundBECall().respond(200, {active: false});

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        $httpBackend.flush();

        expect(teaser.container).toHaveClass('teaser--hero');
        expect(teaser.remainingTime.text()).toBe('Keine aktive Runde');
        expect(teaser.userCount.text()).toBe('33');
    });

    it("should show the teaser when the route changes and the next routes wants a teaser to be shown", function () {
        currentRouteWantsTeaser(false);
        var teaser = renderDirective();

        expect(teaser.container).toHaveClass('teaser--slim');

        expectMetricsBECall().respond(200, {remainingBudget: 123, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-23T22:59:59.000Z'));

        changeRoute({showTeaser: true}, {showTeaser: false});
        $httpBackend.flush();

        expect(teaser.container).toHaveClass('teaser--hero');
    });

    it("should hide the teaser when the route changes and the next routes wants a teaser to be hidden", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 123, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-23T22:59:59.000Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        $httpBackend.flush();

        expect(teaser.container).toHaveClass('teaser--hero');

        changeRoute({showTeaser: false}, {showTeaser: true});

        expect(teaser.container).toHaveClass('teaser--slim');
    });

    it("should update the metrics when the route changes back and forth", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-22T22:59:59.000Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        $httpBackend.flush();

        expect(teaser.remainingBudget.text()).toBe('54.321');

        // new route wants no teaser
        changeRoute({showTeaser: false}, {showTeaser: true});

        expect(teaser.container).toHaveClass('teaser--slim');

        expectMetricsBECall().respond(200, {remainingBudget: 123, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-23T22:59:59.000Z'));

        // new route wants teaser
        changeRoute({showTeaser: true}, {showTeaser: false});
        $httpBackend.flush();

        expect(teaser.container).toHaveClass('teaser--hero');
        expect(teaser.remainingBudget.text()).toBe('123');
        expect(teaser.remainingTime.text()).toBe('Noch 2d 7h 55m 35s');
    });

    it("should reload the data when the time runs out", function () {
        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, financingRound('2015-01-21T15:04:25.003Z'));

        currentRouteWantsTeaser(true);
        var teaser = renderDirective();
        $httpBackend.flush();

        expect(teaser.remainingTime.text()).toBe('Noch 2s');
        elapseTime(1000);
        expect(teaser.remainingTime.text()).toBe('Noch 1s');
        elapseTime(1000);
        expect(teaser.remainingTime.text()).toBe('Keine aktive Runde');

        expectMetricsBECall().respond(200, {remainingBudget: 54321, count: 33});
        expectServerTimeBECall().respond(200, {dateTime: '2015-01-21T15:04:23.003Z'});
        expectFinancingRoundBECall().respond(200, {active: false});
        $timeout.flush(500);
        $httpBackend.flush();
    });


    function elapseTime(ms) {
        // let the next 'new Date()'-calls to return the frozen time + given ms
        jasmine.clock().tick(ms);

        // trigger any $invervals as if ms number of miliseconds passed
        $interval.flush(ms);
    }

    function expectMetricsBECall() {
        return $httpBackend.expectGET('/users/metrics');
    }

    function expectFinancingRoundBECall() {
        return $httpBackend.expectGET('/financingrounds/mostRecent');
    }

    function expectServerTimeBECall() {
        return $httpBackend.expectGET('/datetime');
    }

    function currentRouteWantsTeaser(showTeaser) {
        spyOn(Route, 'getCurrentRoute').and.returnValue({showTeaser: showTeaser});
    }

    function changeRoute(currentRoute, previousRoute) {
        onRouteChangeSuccessListener({}, currentRoute, previousRoute);
        $scope.$digest();
    }

    function financingRound(endDate) {
        return {id: 'xyz', startDate: '2015-01-21T09:04:23.003Z', endDate: endDate, active: true}
    }
});
