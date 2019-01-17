describe('authentication service', function () {

    var $rootScope, $httpBackend, $http, Authentication;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function (_$rootScope_, _$httpBackend_, _$http_, _Authentication_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            Authentication = _Authentication_;
        });

        $httpBackend.whenGET('/user/current').respond(200, {});
    });

    it('should request an access token from the backend and include the access token in every following request', function () {

        login('xyz');
        expectTokenInRequestHeader('xyz');
        expectLoggedIn();
    });

    it('should request an access token from the backend and store the response in localStorage', function () {

        login('zzz');
        var storedTokensString = localStorage['tokens'];
        expect(storedTokensString).toBe('{"token_type":"bearer","access_token":"zzz"}');
    });

    it('should load the access token from the localStorage and include it in every following request', function () {

        storeTokenInLocalStorage('xxx');
        init();
        expectTokenInRequestHeader('xxx');
        expectLoggedIn();
    });

    it('should not use any token if the logout-method was called', function () {

        // logged-in...
        storeTokenInLocalStorage('xxxx');
        init();
        expectTokenInRequestHeader('xxxx');
        expectLoggedIn();

        // log-out
        logout();
        expectNoTokenInRequestHeader();
        expectLoggedOut();
    });

    it('should include no access token in every following request if there was none in localStorage', function () {

        init();
        expectNoTokenInRequestHeader();
        expectLoggedOut();
    });

    function init() {
        Authentication.init();
    }

    function storeTokenInLocalStorage(token) {
        localStorage.setItem('tokens', '{"token_type":"bearer","access_token":"' + token + '"}');
    }

    function login(token) {
        $httpBackend.expectPOST('/oauth/token', 'username=username&password=password&client_id=web&grant_type=password')
            .respond(200, {token_type: 'bearer', access_token: token});

        $httpBackend.expectGET('/user/current').respond(200, {});

        Authentication.login('username', 'password');
        $httpBackend.flush();
    }

    function logout() {
        Authentication.logout();
    }

    function expectTokenInRequestHeader(token) {
        $httpBackend.expectGET('/some-protected-resource', function headersValidator(headers) {
            return headers.Authorization == 'bearer ' + token;
        }).respond(200);
        $http.get('/some-protected-resource');
        $httpBackend.flush();
    }

    function expectNoTokenInRequestHeader() {
        $httpBackend.expectGET('/some-protected-resource', function headersValidator(headers) {
            return headers.Authorization == null;
        }).respond(200);
        $http.get('/some-protected-resource');
        $httpBackend.flush();
    }

    function expectLoggedIn() {
        expect(Authentication.currentUser.loggedIn).toBe(true);
    }

    function expectLoggedOut() {
        expect(Authentication.currentUser.loggedIn).toBe(false);
    }
});
