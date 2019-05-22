describe('project likes', function () {
    var $rootScope, $compile, scope, $httpBackend;
    var likesDirectiveCompiled;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;

            scope = $rootScope.$new();

            scope['project'] = {
                id: "testProjectId",
                likeCount: 0,
                likeStatus: 'UNLIKE'
            };
        });

        mockTranslation();
    });

    it("should show like counts with zero when not data provided on list page", function () {
        givenCompiledDirectiveForListView();
        givenView("list");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes').hasClass('project_likes_list')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_list_count')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('0');
    });

    it("should show like counts with zero when not data provided on detail page", function () {
        givenCompiledDirectiveForDetailView();
        givenView("detail");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes').hasClass('project_likes_detail')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe('0');
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);

    });

    it("should show like counts", function () {
        givenCompiledDirectiveForListView();
        givenView("list");
        givenLikeCount(100);
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('100');
    });

    it("should show like status of user when no data provided on list page", function () {
        givenCompiledDirectiveForListView();
        givenView("list");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
    });

    it("should show like status of when no data provided on detail page", function () {
        givenCompiledDirectiveForDetailView();
        givenView("detail");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
    });

    it("should show status of user after liked project on list page", function () {
        givenCompiledDirectiveForListView();
        givenView("list");
        givenLikeStatus("LIKE");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
    });

    it("should show status of user after liked project on detail page", function () {
        givenCompiledDirectiveForDetailView();
        givenView("detail");
        givenLikeStatus("LIKE");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
    });

    it("should show status of user after unliked project on list page", function () {
        givenCompiledDirectiveForListView();
        givenView("list");

        givenLikeStatus("LIKE");
        scope.$digest();

        givenLikeStatus("UNLIKE");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
    });

    it("should show status of user after unliked project on detail page", function () {
        givenCompiledDirectiveForDetailView();
        givenView("detail");

        givenLikeStatus("LIKE");
        scope.$digest();

        givenLikeStatus("UNLIKE");
        scope.$digest();

        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
    });

    it("should be able to execute like by user on list page", function () {
        givenCompiledDirectiveForListView();
        givenView("list");
        scope.$digest();

        // before click
        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('0');

        givenLikeClickedOnListPage();
        scope.$digest();

        // before server responded
        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('1');

        var responseProject = angular.copy(likesDirectiveCompiled.isolateScope().project);
        // honors response from server
        responseProject.likeCount = 100;
        $httpBackend.expectGET('/project/' + likesDirectiveCompiled.isolateScope().project.id).respond(200, responseProject);
        $httpBackend.flush();

        //after server responded
        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('100');
    });

    it("should be able to execute like by user on detail page", function () {
        givenCompiledDirectiveForDetailView();
        givenView("detail");
        scope.$digest();

        // before click
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe('0');

        givenLikeClickedOnDetailPage();
        scope.$digest();

        // before server responded
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe('1');

        var responseProject = angular.copy(likesDirectiveCompiled.isolateScope().project);
        // honors response from server
        responseProject.likeCount = 100;
        $httpBackend.expectGET('/project/' + likesDirectiveCompiled.isolateScope().project.id).respond(200, responseProject);
        $httpBackend.flush();

        //after server responded
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe('100');
    });

    it("should be able to execute unlike by user on list page", function () {
        var initCount = 5;

        givenCompiledDirectiveForListView();
        givenView("list");
        givenLikeCount(initCount);
        givenLikeStatus('LIKE');

        scope.$digest();

        // before click
        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe("" + initCount);

        givenUnlikeClickedOnListPage();
        scope.$digest();

        // before server responded
        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('4');

        var responseProject = angular.copy(likesDirectiveCompiled.isolateScope().project);
        // honors response from server
        responseProject.likeCount = 100;
        $httpBackend.expectGET('/project/' + likesDirectiveCompiled.isolateScope().project.id).respond(200, responseProject);
        $httpBackend.flush();

        //after server responded
        expect(likesDirectiveCompiled.find('.project_likes_list_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
        expect(likesDirectiveCompiled.find('.project_likes_list_count').text()).toBe('100');
    });

    it("should be able to execute unlike by user on detail page", function () {
        var initCount = 5;

        givenCompiledDirectiveForDetailView();
        givenView("detail");
        givenLikeCount(initCount);
        givenLikeStatus('LIKE');

        scope.$digest();

        // before click
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(true);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe("" + initCount);

        givenUnlikeClickedOnDetailPage();
        scope.$digest();

        // before server responded
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe('4');

        var responseProject = angular.copy(likesDirectiveCompiled.isolateScope().project);
        // honors response from server
        responseProject.likeCount = 100;
        $httpBackend.expectGET('/project/' + likesDirectiveCompiled.isolateScope().project.id).respond(200, responseProject);
        $httpBackend.flush();

        //after server responded
        expect(likesDirectiveCompiled.find('.project_likes_detail_status')).toExist();
        expect(likesDirectiveCompiled.find('.project_likes').hasClass('liked')).toBe(false);
        expect(likesDirectiveCompiled.find('.project_likes_detail_count').text()).toBe('100');
    });

    function givenCompiledDirectiveForListView() {
        likesDirectiveCompiled = $compile('<project-likes project="project", view="list"></project-likes>')(scope);
        scope.$digest();
    };

    function givenCompiledDirectiveForDetailView() {
        likesDirectiveCompiled = $compile('<project-likes project="project", view="detail"></project-likes>')(scope);
        scope.$digest();
    };

    function givenView(view) {
        likesDirectiveCompiled.isolateScope().view = view;
    }

    function givenLikeCount(count) {
        likesDirectiveCompiled.isolateScope().project.likeCount = count;
    }

    function  givenLikeStatus(status) {
        likesDirectiveCompiled.isolateScope().project.likeStatus = status;
    }

    function givenLikeClickedOnListPage() {
        $httpBackend.expectPOST('/projects/' + likesDirectiveCompiled.isolateScope().project.id + '/likes').respond(200);
        likesDirectiveCompiled.find('.project_likes_list_status').click();
    }

    function givenLikeClickedOnDetailPage() {
        $httpBackend.expectPOST('/projects/' + likesDirectiveCompiled.isolateScope().project.id + '/likes').respond(200);
        likesDirectiveCompiled.find('.project_likes_detail_status').click();
    }

    function givenUnlikeClickedOnListPage() {
        $httpBackend.expectDELETE('/projects/' + likesDirectiveCompiled.isolateScope().project.id + '/likes').respond(200);
        likesDirectiveCompiled.find('.project_likes_list_status').click();
    }

    function givenUnlikeClickedOnDetailPage() {
        $httpBackend.expectDELETE('/projects/' + likesDirectiveCompiled.isolateScope().project.id + '/likes').respond(200);
        likesDirectiveCompiled.find('.project_likes_detail_status').click();
    }
});