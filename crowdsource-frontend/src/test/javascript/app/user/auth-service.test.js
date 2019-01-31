describe('authentication service', function () {

    var $rootScope, $httpBackend, $http, Authentication, AuthenticationToken;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        localStorage.clear();

        inject(function (_$rootScope_, _$httpBackend_, _$http_, _Authentication_, _AuthenticationToken_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            Authentication = _Authentication_;
            AuthenticationToken = _AuthenticationToken_;
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

    it('should set roles from existing jwt on reload', function () {

        logout();
        expect(Authentication.currentUser.roles).toBeFalsy();
        var spy = spyOn(AuthenticationToken, 'getTokens').and.returnValue({"access_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODA0NjY3NjAsInVzZXJfbmFtZSI6ImNzX2FkbWluQGNyb3dkLnNvdXJjZS5kZSIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwianRpIjoiZGI5MDk2NjUtMzA2My00MmM2LTg4YjQtMDBmZjI5NmUxYjM3IiwiY2xpZW50X2lkIjoid2ViIiwic2NvcGUiOlsiZGVmYXVsdCJdfQ.Pol2WLAiq1FO6fUY_HCix95LwwfyDFGnB4yW2mXhJOzUO3nnpCBKWCyn5tMv9ZtlxcTtJHlVWKUJRZwjwIdhDaWQ9cW0TaY7mNDoV-kMlnXi8_sm1a3a_DZJmohDjz4GG1Ou5ADKPCRtie2OfdJO5e4Kctgh9boZfGCA9UTIBPDqWmdOhoj0Ttgj8bEwjbhsh7ro0sniPqvZwRGFelRhCz9W2UKCdeMtBeWSjCnvHNHR-rfn8BICjD9rSR4mf6PTUT_pJuHsZY6ZJCRevOrZINkxO1nu_RPS-1FMtI2WFdQOXL7gQpoVhMIzOGrXxJ69umfHZGZsiTBog-e6A-OPRQ","token_type":"bearer","refresh_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJjc19hZG1pbkBjcm93ZC5zb3VyY2UuZGUiLCJzY29wZSI6WyJkZWZhdWx0Il0sImF0aSI6ImRiOTA5NjY1LTMwNjMtNDJjNi04OGI0LTAwZmYyOTZlMWIzNyIsImV4cCI6MTU1MTUyMjc2MCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJqdGkiOiI3OGE3NDcwYy03NzNiLTRmYTUtYjM0Ny1lMTJhYzI0MWYzMmMiLCJjbGllbnRfaWQiOiJ3ZWIifQ.aHrIoNoWJYnB6m6jIduTIa7wJ2JG7_zqFrZiJFg9diFCLgBI907tdvuR0UEcwPQHnkL75MqBkuxwM-YqMdUFi63S7EJTvJHEwojZr9blaMOBwUv3QCe72YJhqBNBYUynPOmTuFGmgncVt8gkZt_5TzA9PgK-cAiNxrjlrA4gPFceRr5hZpQ0uy6vR7kWleqxFG2KP5coSZvnVp-A4sKQTdb3S9OBkAr6jdlz9cYMN0_S62x0Rs_bx7hquyciaT_tg1o4TUXkg-nO0LpyCiPivIvx27Ym6uvzomm1Qf-zvgr9g27JEV5BCl6d4M0KATv9nrVP-Y7hRywEFnJF_ViAgQ","expires_in":31535999,"scope":"default","jti":"db909665-3063-42c6-88b4-00ff296e1b37"});

        Authentication.init();
        expect(Authentication.currentUser.roles).toBeTruthy();
        expect(Authentication.currentUser.roles.length).toBe(2);
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
