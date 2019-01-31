describe('ideas status bar', function () {

    var $rootScope, $compile, $httpBackend, scope, Authentication, currentUser, currentRoute, Route;

    beforeEach(function () {
        module('crowdsource.templates');
        module('crowdsource');

        localStorage.clear();

        inject(function (_$compile_, _$rootScope_, _Authentication_, _$httpBackend_, _Route_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            Authentication = _Authentication_;
            Route = _Route_;

            scope.campaign = {id: '123', title: 'sometitle', endDate: new Date().getDate(), active: true};
            currentUser = {
                isLoggedIn: true
            };

            currentRoute = {
                title: 'Ideen Kampagne'
            };
            spyOn(Route, 'onRouteChangeSuccessAndInit').and.returnValue(null);

        });
    });

    it("should show no admin button when user is not admin", function () {
        givenUserIsAdmin(false);

        var statusBar = compileDirective(scope);

        expect(statusBar.adminButton()).not.toExist();
    });

    it("should show admin button when user is admin", function () {
        givenUserIsAdmin(true);

        var statusBar = compileDirective(scope);

        expect(statusBar.adminButton()).toExist();
    });

    it("should render end date  when campaign is active", function () {
        scope.campaign.endDate = new Date().getTime() + 2000;
        scope.campaign.active = true;

        var statusBar = compileDirective(scope);

        expect(statusBar.element.html()).toContain("Kampagne läuft bis:");
    });

    it("should render end date  when campaign is not active", function () {
        scope.campaign.endDate =  new Date().getTime() - 2000;
        scope.campaign.active = false;

        var statusBar = compileDirective(scope);

        expect(statusBar.element.html()).toContain("Kampagne endete am:");
    });

    function givenUserIsAdmin(isAdminFlag) {
        $httpBackend.expectGET('/user/current').respond(200, currentUser);
        Authentication.currentUser = currentUser;
        spyOn(Authentication, 'isAdmin').and.returnValue(isAdminFlag);
        scope.$digest();
    }

    function compileDirective(scope) {
        var compiled = $compile('<ideas-status-bar campaign="campaign"></ideas-status-bar>')(scope);
        scope.$digest();
        return new IdeasStatusBar(compiled);
    }
});