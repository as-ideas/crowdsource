describe('user logout view', function () {

    var Authentication, html, $httpBackend;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear(); // reset
        mockTranslation();

        inject(function ($compile, $rootScope, $templateCache, $controller, _$httpBackend_, _Authentication_) {

            $httpBackend = _$httpBackend_;
            Authentication = _Authentication_;

            spyOn(Authentication, 'logout');

            var $scope = $rootScope.$new();

            $controller('UserLogoutController as logout', {
                $scope: $scope,
                Authentication: Authentication
            });

            var template = $templateCache.get('app/user/logout/user-logout.html');
            html = $compile(template)($scope);

            $scope.$digest();
        });

    });

    it('should invoke Authentication.logout() on page view', function () {
        expect(Authentication.logout).toHaveBeenCalled();
    });

    it('should display logout text', function () {
        expect(html).toContainText('Du wurdest ausgeloggt');
    });
});