describe('status bar', function () {

    var $rootScope, $compile, statusBar, scope, FinancingRound, Authentication, currentUser, currentRound;

    beforeEach(function () {
        module('crowdsource.templates');
        module('crowdsource');

        inject(function (_$compile_, _$rootScope_, _FinancingRound_, _Authentication_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $compile = _$compile_;
            FinancingRound = _FinancingRound_;
            Authentication = _Authentication_;
            var statusBarDirectiveCompiled = $compile('<status-bar></status-bar>')(scope);
            statusBar = new StatusBar(statusBarDirectiveCompiled);

            scope['status'] = {};
            currentUser = {
                loggedIn: false,
                budget : 17,
                hasRole : function(roleReq){
                    return false;
                }
            };
            currentRound = {
                active : true,
                postRoundBudgetDistributable : false,
                postRoundBudgetRemaining : 0
            };
        });
    });

    it("should show no budget when user not logged in", function () {
        expect(statusBar.userBudget()).not.toBeVisible();
        expect(statusBar.postRoundBudgetRemaining()).not.toBeVisible();
    });

    it("should show users budget on active financing round when logged in", function () {
        currentUser.loggedIn = true;

        spyOnCurrentUserAndFinancingRound();

        expect(statusBar.userBudget()).toContainText('17 €');
        expect(statusBar.postRoundBudgetRemaining()).not.toBeVisible();
    });

    it("should show postRoundBudget remaining for admin users on not active financing round", function () {
        currentRound.active = false;
        currentRound.postRoundBudgetDistributable = true;
        currentRound.postRoundBudgetRemaining = 1337;
        currentUser.loggedIn = true;
        var captureRequestedRole = undefined;
        currentUser.hasRole = function (reqRole)  {
            captureRequestedRole = reqRole;
            return true;
        };

        spyOnCurrentUserAndFinancingRound();

        expect(statusBar.userBudget()).toContainText('17 €');
        expect(statusBar.postRoundBudgetRemaining()).toContainText('1.337 €');
        expect(captureRequestedRole).toBe("ADMIN");
    });

    function spyOnCurrentUserAndFinancingRound() {
        spyOn(FinancingRound, 'currentFinancingRound').and.returnValue(currentRound);
        Authentication.currentUser = currentUser;
        scope.$digest();
    }

});