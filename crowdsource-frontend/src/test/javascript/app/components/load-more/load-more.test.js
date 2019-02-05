describe('load more', function () {
    var $rootScope, $compile, $scope, $httpBackend;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;

            $scope = $rootScope.$new();
        });
    });

    it('should render LOAD MORE text, when data can be loaded', function () {

        var loadMoreText = "Mehr Daten laden";
        $scope.paging = givenMultiplePagesPresent();
        $scope.loadFn = function loadFn(pageNumber) { };

        var view = compileDirective($scope);

        expect(view.getLabel()).toContain(loadMoreText);
    });

    it('should render default NO MORE DATA text, when  no data can be loaded', function () {

        var noMoreText = "Keine Daten mehr";
        $scope.paging = givenNoMorePagesPresent();
        $scope.loadFn = function loadFn(pageNumber) { };

        var view = compileDirective($scope);

        expect(view.getLabel()).toContain(noMoreText);
    });

    it('should render given text, when data can be loaded', function () {

        var loadMoreText = "mehr mehr";
        $scope.paging = givenMultiplePagesPresent();
        $scope.loadFn = function loadFn(pageNumber) { };
        $scope.loadMoreLabel = loadMoreText;

        var view = compileDirective($scope);

        expect(view.getLabel()).toContain(loadMoreText);
    });

    it('should render given text, when  no data can be loaded', function () {

        var noMoreText = "nüscht da";
        $scope.paging = givenNoMorePagesPresent();
        $scope.loadFn = function loadFn(pageNumber) { };
        $scope.noMoreLabel = noMoreText;

        var view = compileDirective($scope);

        expect(view.getLabel()).toContain(noMoreText);
    });

    it('should call callback, when  more data can be loaded', function () {

        var loadFn = jasmine.createSpy('loadFn');
        $scope.paging = givenMultiplePagesPresent();
        $scope.loadFn = loadFn;

        var view = compileDirective($scope);
        view.clickButton();

        expect(loadFn).toHaveBeenCalledWith($scope.paging.number + 1);
    });

    it('should not call callback, when  no more data can be loaded', function () {

        var loadFn = jasmine.createSpy('loadFn');
        $scope.paging = givenNoMorePagesPresent();
        $scope.loadFn = loadFn;

        var view = compileDirective($scope);
        view.clickButton();

        expect(loadFn).not.toHaveBeenCalled();
    });

    function compileDirective($scope) {

        var view = $compile('<div><load-more paging="paging" load-fn="loadFn" load-more-label="{{loadMoreLabel}}" no-more-label="{{noMoreLabel}}"></load-more></div>')($scope);
        $scope.$digest();
        return new LoadMoreView(view);
    }

    function givenMultiplePagesPresent() {
        return {
            page: 0,
            number: 0,
            last: false
        };
    }
    function givenNoMorePagesPresent() {
        return {
            page: 2,
            number: 2,
            last: true
        };
    }
});