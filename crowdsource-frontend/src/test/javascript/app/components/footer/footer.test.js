describe('Footer', function () {

    var $rootScope, $scope, $compile, $httpBackend;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function (_$rootScope_, _$compile_, _$httpBackend_, _Authentication_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            Authentication = _Authentication_;
        });

        $httpBackend.expectGET('/content').respond(204);
    });

    function renderDirective() {
        var root = $compile('<footer></footer>')($scope);
        $scope.$digest();

        return root;
    }

    it("Should show login and register link if user is not logged in", function () {
        Authentication.currentUser.loggedIn = false;
        var footer = renderDirective();
        expect(footer.find('a[href="#/login"]')).toExist();
        expect(footer.find('a[href="#/signup"]')).toExist();
    });

    it("Should NOT show login and register link if user is logged in", function () {
        Authentication.currentUser.loggedIn = true;
        var footer = renderDirective();
        expect(footer.find('a[href="#/login"]')).not.toExist();
        expect(footer.find('a[href="#/signup"]')).not.toExist();
    });


});
