describe("statistics result", function () {

    var $rootScope, $compile, scope, $httpBackend;
    var compiledDirective;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();
        mockTranslation();

        inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;

            scope = $rootScope.$new();

            scope['data'] = {
                info: undefined,
                availablePageOptions: {
                    NONE: {
                        label: "-- Bitte auswählen --",
                        name: "NONE"
                    },
                    CURRENT: {
                        label: "Anzahl Neuregistrieung / Neu eingereichte Ideen",
                        name: "CURRENT"
                    }

                },
                statisticType: {
                    label: "-- Bitte auswählen --",
                    name: "NONE"
                }
            };
        });
    });

    it("should be able to toggle result", function () {
        givenCompiledDirective();

        whenStatisticTypeSelected(compiledDirective.isolateScope().data.availablePageOptions.CURRENT);
        scope.$digest();

        expect(compiledDirective.find('.statistic-result').hasClass('ng-hide')).toBe(false);

        whenStatisticTypeSelected(compiledDirective.isolateScope().data.availablePageOptions.NONE);
        scope.$digest();
        expect(compiledDirective.find('.statistic-result').hasClass('ng-hide')).toBe(true);
    });

    function givenCompiledDirective() {
        compiledDirective = $compile('<statistics-result data="data"></statistics-result>')(scope);
        scope.$digest();
    };

    function whenStatisticTypeSelected(type) {
        compiledDirective.isolateScope().data.statisticType = type;
    };
});