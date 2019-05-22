describe('statistics form', function () {
    var $rootScope, $compile, scope, $httpBackend, STATISTICS_CONST, statisticsForm;
    var compiledDirective;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();
        mockTranslation();

        inject(function (_$compile_, _$rootScope_, _$httpBackend_, _STATISTICS_CONST_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            STATISTICS_CONST = _STATISTICS_CONST_;

            scope = $rootScope.$new();

            scope['data'] = {
                info: undefined
            };

        });
    });

    it("should clear info when clear info button clicked.", function () {
        givenCompiledDirective();
        givenInfoShows("test");
        scope.$digest();

        // before click
        expect(statisticsForm.getAlertBox()).toExist();

        givenClickOnClose();

        // after click
        expect(compiledDirective.find('.alert-box__statistics')).not.toExist();
    });

    it("should show data pickers when CURRENT statistic type selected", function () {
        givenCompiledDirective();
        scope.$digest();
        expect(statisticsForm.getSelectsFormForTypeCurrent()).not.toExist();

        $httpBackend.expectGET(/.*?statistics\/current?.*/g).respond(200, [
            {   "name":"Eingereichte Projekte",
                "data":[{"data":0,"label":"2016-01-01"},{"data":0,"label":"2016-01-02"},{"data":2110,"label":"2016-01-15"}]},
            {   "name":"Neuregistrierungen",
                "data":[{"data":0,"label":"2016-01-01"},{"data":0,"label":"2016-01-02"},{"data":0,"label":"2016-01-03"}]}
        ]);

        whenStatisticTypeSelected(STATISTICS_CONST.PAGES.CURRENT);
        scope.$digest();

        expect(statisticsForm.getSelectsFormForTypeCurrent()).toExist();
    });

    it("should show data pickers when COMMENT_SUM statistic type selected", function () {
        givenCompiledDirective();
        expect(statisticsForm.getSelectsFormForTypeCurrent()).not.toExist();

        $httpBackend.expectGET(/.*?statistics\/comments\/sum?.*/g).respond(200, [{}]);

        whenStatisticTypeSelected(STATISTICS_CONST.PAGES.COMMENT_SUM);
        scope.$digest();

        expect(statisticsForm.getSelectsFormForTypeCurrent()).toExist();
    });

    it("should not show data pickers when PROJECT_PER_STATUS statistic type selected", function () {
        givenCompiledDirective();
        scope.$digest();

        expect(statisticsForm.getSelectsFormForTypeCurrent()).not.toExist();

        $httpBackend.expectGET('/statistics/projects_per_status').respond(200, [{id: "BLA", name: "A_BLA_NAME", count: 2}, {id: "BLA_2", name: "A_BLA_NAME_2", count: 3}]);

        whenStatisticTypeSelected(STATISTICS_CONST.PAGES.PROJECT_SUM_PER_STATUS);
        scope.$digest();
        $httpBackend.flush();

        expect(statisticsForm.getSelectsFormForTypeCurrent()).not.toExist();
    });

    it("should call backend when PROJECT_PER_STATUS statistic type selected", function () {
        givenCompiledDirective();

        scope.$digest();

        $httpBackend.expectGET('/statistics/projects_per_status').respond(200, [{id: "BLA", name: "A_BLA_NAME", count: 2}, {id: "BLA_2", name: "A_BLA_NAME_2", count: 3}]);

        whenStatisticTypeSelected(STATISTICS_CONST.PAGES.PROJECT_SUM_PER_STATUS);

        $httpBackend.flush();
        scope.$digest();

        expect(statisticsForm.getSelectsFormForTypeCurrent()).not.toExist();
        expect(statisticsForm.getSelectedStatisticsType()).toHaveText(STATISTICS_CONST.PAGES.PROJECT_SUM_PER_STATUS.label);
        expect(statisticsForm.getSelectedStatisticsType()).toHaveValue(STATISTICS_CONST.PAGES.PROJECT_SUM_PER_STATUS.name);

    });

    it("should call backend when COMMENT_SUM statistic type selected", function () {
        givenCompiledDirective();

        $httpBackend.expectGET(/.*?statistics\/comments\/sum?.*/g).respond(200, [{"name":"Summe Kommentare","data":[]}]);

        whenStatisticTypeSelected(STATISTICS_CONST.PAGES.COMMENT_SUM);

        $httpBackend.flush();
        scope.$digest();

        expect(statisticsForm.getSelectsFormForTypeCurrent()).toExist();
        expect(statisticsForm.getSelectedStatisticsType()).toHaveText(STATISTICS_CONST.PAGES.COMMENT_SUM.label);
        expect(statisticsForm.getSelectedStatisticsType()).toHaveValue(STATISTICS_CONST.PAGES.COMMENT_SUM.name);

    });

    it("should show count picker when COMMENT_SUM_PER_PROJECT statistic type selected", function () {
        givenCompiledDirective();
        scope.$digest();
        expect(statisticsForm.getSelectsFormForTypeCountPerProject()).not.toExist();

        compiledDirective.isolateScope().data.projectCount = {label: 'whatever', value: 20};

        $httpBackend.expectGET('/statistics/comment_count_per_project?projectCount=20').respond(200);

        whenStatisticTypeSelected(STATISTICS_CONST.PAGES.COMMENT_SUM_PER_PROJECT);
        scope.$digest();

        expect(statisticsForm.getSelectsFormForTypeCountPerProject()).toExist();
    });

    function givenCompiledDirective() {

        compiledDirective = $compile('<statistics-form data="data"></statistics-form>')(scope);
        statisticsForm = new StatisticsForm(compiledDirective);
        scope.$digest();
    };

    function givenInfoShows(infoText) {
        compiledDirective.isolateScope().data.info = infoText;
    };

    function givenClickOnClose() {
        compiledDirective.find('.close').click();
    };

    function whenStatisticTypeSelected(type) {
        compiledDirective.isolateScope().data.statisticType = type;
        compiledDirective.isolateScope().statisticTypeChanged();
    };
});