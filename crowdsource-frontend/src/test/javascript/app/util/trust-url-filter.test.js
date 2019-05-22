describe('trust-url filter', function () {

    var $compile, $rootScope, $scope;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');
        mockTranslation();

        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        });
    });
    describe('trustUrl', function () {
        it("should render truested url", function () {
            $scope.videoUrl = "https://www.google.de";
            var view = $compile('<div><video src="{{videoUrl | trustUrl}}" controls></video></div>')($scope);
            $scope.$digest();

            expect(view.html()).toContain($scope.videoUrl);
        });

        it("should not render truested url when filter is missing", function () {
            $scope.videoUrl = "https://www.google.de";
            var view;
            try {
                // will throw interpolation error
                view = $compile('</div><video src="{{videoUrl}}" controls></video></div>')($scope);
                $scope.$digest();
            } catch (e) {
            }

            expect(view).not.toBeTruthy();
        });
    });
});
