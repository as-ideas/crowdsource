describe('ideas status bar', function () {

    var $rootScope, $compile, $httpBackend, statusBar, scope, Authentication, currentUser, currentRoute, Route;

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

            scope.campaign = {id: '123', title: 'sometitle', endDate: new Date().getDate()};
            currentUser = {
                isLoggedIn: true
            };

            currentRoute = {
                title: 'Ideen Kampagne'
            };
            spyOn(Route, 'onRouteChangeSuccessAndInit').and.returnValue(null);

            var statusBarDirectiveCompiled = $compile('<ideas-status-bar campaign="campaign"></ideas-status-bar>')(scope);
            statusBar = new IdeasStatusBar(statusBarDirectiveCompiled);
        });
    });

    it("should show no admin button when user is not admin", function () {
        givenUserIsAdmin(false);
        expect(statusBar.adminButton()).not.toExist();
    });

    it("should show admin button when user is admin", function () {
        givenUserIsAdmin(true);
        expect(statusBar.adminButton()).toExist();
    });

    function givenUserIsAdmin(isAdminFlag) {
        $httpBackend.expectGET('/user/current').respond(200, currentUser);
        Authentication.currentUser = currentUser;
        spyOn(Authentication, 'isAdmin').and.returnValue(isAdminFlag);
        scope.$digest();
    }
});