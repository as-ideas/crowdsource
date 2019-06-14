describe('idea-tile', function () {

    var $scope, $httpBackend, $compile, IDEAS_STATUS;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();
        mockTranslation();

        inject(function ($rootScope, _$httpBackend_, _$compile_, _IDEAS_STATUS_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $compile = _$compile_;
            IDEAS_STATUS = _IDEAS_STATUS_;

            $scope.campaign = {id:'some_id'}
        });

    });
  /*
      describe('user', function() {
          it("should render title, pitch and author", function () {

              var idea = givenIdea();
              $scope.idea = idea;
              $scope.admin = false;
              var view = compileDirective($scope);

              // TODO:
              // Fix issue due to translation filter
              // expect(view.getTitle()).toBe(idea.title);
              // expect(view.getPitch()).toContain(idea.pitch);

              expect(view.getAuthor()).toContain(idea.creatorName);
          });

          it("not show admin functionality when user not admin", function () {
              var idea = givenIdea(IDEAS_STATUS.PROPOSED);
              $scope.admin = false;
              $scope.idea = idea;
              var view = compileDirective($scope);

              expect(view.getApprovalContainer()).not.toExist();
          });

          it("should allow user to vote if idea is in state published", function () {

          });
      });
  */
    describe('admin', function () {
        it("show admin functionality when user isAdmin", function () {
            var idea = givenIdea(IDEAS_STATUS.PROPOSED);
            $scope.admin = true;
            $scope.idea = idea;
            var view = compileDirective($scope);

            expect(view.getApprovalContainer()).toExist();
        });

        it("should allow ADMIN to approved or reject if idea is in state "+IDEAS_STATUS.PROPOSED, function () {
            var idea = givenIdea(IDEAS_STATUS.PROPOSED);
            $scope.admin = true;
            $scope.idea = idea;
            var view = compileDirective($scope);

            expect(view.getApprovalButton()).toExist();
            expect(view.getRejectButton()).toExist();
        });

        it("should show rejection message if in state "+IDEAS_STATUS.REJECTED, function () {
            var idea = givenIdea(IDEAS_STATUS.REJECTED);
            $scope.admin = true;
            $scope.idea = idea;
            var view = compileDirective($scope);

            expect(view.getApprovalButton()).not.toExist();
            expect(view.getRejectButton()).not.toExist();

            expect(view.getRejectionMessage()).toExist();
            expect(view.getPublishedMessage()).not.toExist();
        });

        it("should show rejection message if in state "+IDEAS_STATUS.PUBLISHED, function () {
            var idea = givenIdea(IDEAS_STATUS.PUBLISHED);
            $scope.admin = true;
            $scope.idea = idea;
            var view = compileDirective($scope);

            expect(view.getApprovalButton()).not.toExist();
            expect(view.getRejectButton()).not.toExist();

            expect(view.getRejectionMessage()).not.toExist();
            expect(view.getPublishedMessage()).toExist();
        });
    });

    function compileDirective($scope) {
        var view = $compile('<idea-tile idea="idea" campaign="campaign" admin="admin"></idea-tile>')($scope);
        $scope.$digest();

        return new IdeaTile(view);
    }

    function givenIdea(state) {
        return {
            "id": "5c4b25ef307d0a243bbd000c",
            "creatorName": "Admin",
            "status": state || IDEAS_STATUS.PUBLISHED,
            "creationDate": 1548428783607,
            "content": {
                "de": {
                    "title": "ein paar Z",
                    "pitch": "eine kurzer Satz"
                },
                "en": {
                    "title": "ein paar Z",
                    "pitch": "eine kurzer Satz"
                }
            }
        }
    }
});