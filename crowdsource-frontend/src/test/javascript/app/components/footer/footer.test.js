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

    it("Should show Admin links if user is logged in as Admin", function () {
        Authentication.isAdmin = function(){return true}
        var footer = renderDirective();
        expect(footer.find('a[href="#/statistics"]')).toExist();
    });

    it("Should show Admin links if user is not logged in as Admin", function () {
        Authentication.isAdmin = function(){return false}
        var footer = renderDirective();
        expect(footer.find('a[href="#/statistics"]')).not.toExist();
    });


});
