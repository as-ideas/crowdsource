(function () {

    function isBrowserSupported() {

        if (bowser.chrome && bowser.version < 39) {
            return false;
        }
        if (bowser.firefox && bowser.version < 24) {
            return false;
        }
        if (bowser.safari && bowser.version < 8) {
            return false;
        }
        if (bowser.msie && bowser.version < 9) {
            return false;
        }
        return true;
    }

    /**
     * global application configuration
     */
    angular.module('crowdsource', ['ngRoute', 'ngResource', 'ngMessages', 'dibari.angular-ellipsis', 'ngScrollTo',
                    'ngSanitize', 'ng-showdown', 'ngFileUpload', 'ngclipboard', 'chart.js'])
        .config(function ($routeProvider, $locationProvider, $httpProvider, $showdownProvider) {
            $routeProvider
                .when('/intro', {
                    templateUrl: 'app/intro/intro.html',
                    // controller: 'IntroController as intro',
                    title: 'Vorstellung'
                })
                .when('/projects', {
                    templateUrl: 'app/project/list/project-list.html',
                    controller: 'ProjectListController as projectList',
                    title: 'Projekte',
                    showTeaser: true
                })
                .when('/project/new', {
                    templateUrl: 'app/project/form/project-form.html',
                    controller: 'ProjectFormController as projectForm',
                    title: 'Neues Projekt',
                    requireLogin: true
                })
                .when('/project/new/:projectId', {
                    templateUrl: 'app/project/form/project-form-success.html',
                    controller: 'ProjectFormSuccessController as projectFormSuccess',
                    requireLogin: true,
                    title: 'Neues Projekt angelegt'
                })
                .when('/project/:projectId', {
                    templateUrl: 'app/project/details/project-details.html',
                    controller: 'ProjectDetailsController as projectDetails',
                    title: 'Projektdetails'
                })
                .when('/project/:projectId/edit', {
                    templateUrl: 'app/project/form/project-form.html',
                    controller: 'ProjectFormController as projectForm',
                    requireLogin: true,
                    title: 'Projekt bearbeiten'
                })
                .when('/login', {
                    templateUrl: 'app/user/login/user-login.html',
                    controller: 'UserLoginController as login',
                    title: 'Login'
                })
                .when('/signup', {
                    templateUrl: 'app/user/signup/user-signup.html',
                    controller: 'UserSignupController as signup',
                    title: 'Registrierung'
                })
                .when('/signup/:email/:firstName/:lastName/success', {
                    templateUrl: 'app/user/signup/user-signup-success.html',
                    controller: 'UserSignupSuccessController as signupSuccess',
                    title: 'Registrierung erfolgreich'
                })
                .when('/signup/:email/activation/:activationToken', {
                    templateUrl: 'app/user/activation/user-activation.html',
                    controller: 'UserActivationController as activation',
                    title: 'Aktivierung'
                })
                .when('/login/password-recovery', {
                    templateUrl: 'app/user/password-recovery/password-recovery.html',
                    controller: 'PasswordRecoveryController as passwordRecovery',
                    title: 'Passwort vergessen'
                })
                .when('/login/password-recovery/:email/success', {
                    templateUrl: 'app/user/password-recovery/password-recovery-success.html',
                    controller: 'PasswordRecoverySuccessController as passwordRecoverySuccess',
                    title: 'Passwort vergessen erfolgreich'
                })
                .when('/login/password-recovery/:email/activation/:activationToken', {
                    templateUrl: 'app/user/activation/user-activation.html',
                    controller: 'UserActivationController as activation',
                    title: 'Passwort setzen'
                })
                .when('/financingrounds', {
                    templateUrl: 'app/financing-rounds/financing-rounds.html',
                    controller: 'FinancingRoundsController as financingRounds',
                    title: 'Finanzierungsrunden',
                    requireLogin: true
                })
                .when('/statistics', {
                    templateUrl: 'app/statistics/statistics.html',
                    controller: 'StatisticsController as statistics',
                    title: 'Statistiken',
                    requireLogin: true
                })
                .when('/about', {
                    templateUrl: 'app/misc/about.html',
                    title: 'Über Uns'
                })
                .when('/faq', {
                    templateUrl: 'app/misc/faq.html',
                    title: 'FAQs'
                })
                .when('/imprint', {
                    templateUrl: 'app/misc/imprint.html',
                    title: 'Impressum'
                })
                .when('/logout', {
                    templateUrl: 'app/user/logout/user-logout.html',
                    controller: 'UserLogoutController as logout',
                    title: 'Logout'
                })
                .when('/error/notfound', {
                    templateUrl: 'app/error/error-notfound.html',
                    title: 'Seite nicht gefunden'
                })
                .when('/error/forbidden', {
                    templateUrl: 'app/error/error-forbidden.html',
                    title: 'Zugriff verweigert'
                })
                .when('/error/unknown', {
                    templateUrl: 'app/error/error-unknown.html',
                    title: 'Technischer Fehler'
                })
                .otherwise({redirectTo: '/intro'});

            $httpProvider.interceptors.push('UnauthorizedInterceptor');
            $httpProvider.interceptors.push('LoggingInterceptor');

            $showdownProvider.setOption("tables", true);
            $showdownProvider.setOption("literalMidWordUnderscores", true);
            $showdownProvider.setOption("headerLevelStart", 3);
            $showdownProvider.setOption("sanitize", true);
        })


        .run(function (Authentication, Route) {

            Authentication.init();
            Route.init();

            // initialize foundation widgets
            $(document).foundation({
                equalizer: {
                    // required to work with block grids
                    equalize_on_stack: true
                }
            });
        });

    angular.module('crowdsource').value('Bowser', bowser);

    if (isBrowserSupported()) {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['crowdsource']);
        });

    } else {
        $(document).ready(function () {
            $('.browser-fallback').show();
        });
    }

})();
