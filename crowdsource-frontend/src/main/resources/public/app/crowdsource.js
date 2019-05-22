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
                    'ngSanitize', 'ng-showdown', 'ngFileUpload', 'ngclipboard', 'chart.js', 'pascalprecht.translate'])

        .constant('ROUTE_DETAILS', {
            JSON_ROOT: '$$route',
            ATTR_CAMPAIGN: 'campaign',
            ATTR_IS_OVERVIEW: 'isOverview',
            VALUE_CAMPAIGN_IDEA: 'ideas',
            VALUE_CAMPAIGN_PROTOTYPE: 'prototype'
        })

        .config(function ($routeProvider, $locationProvider, $httpProvider, $showdownProvider, $translateProvider, ROUTE_DETAILS) {
            $translateProvider
                .translations('de', {
                    'HELLO': 'Hallo Welt :D'
                })
                .translations('en', {
                    'HELLO': 'Hello World'
                })
                .preferredLanguage('de')
                .useMissingTranslationHandlerLog();

            $routeProvider
                .when('/intro', {
                    templateUrl: 'app/intro/intro.html',
                    controller: 'IntroController as intro',
                    title: 'Übersicht'
                })
                .when('/ideas/:ideasId', {
                    templateUrl: 'app/ideas/list/ideas-list.html',
                    controller: 'IdeasListController as ideasList',
                    title: 'Übersicht',
                    requireLogin: true,
                    campaign: ROUTE_DETAILS.VALUE_CAMPAIGN_IDEA,
                    isOverview: true,
                    resolve: {
                        campaign: function(IdeasCampaignResolver) {
                            return IdeasCampaignResolver.resolve();
                        }
                    }
                })
                .when('/ideas/:ideasId/own', {
                    templateUrl: 'app/ideas/own/own-list.html',
                    controller: 'IdeasOwnController as ideasList',
                    title: 'Deine Ideen',
                    requireLogin: true,
                    campaign: ROUTE_DETAILS.VALUE_CAMPAIGN_IDEA,
                    resolve: {
                      campaign: function (IdeasCampaignResolver) {
                        return IdeasCampaignResolver.resolve();
                      }
                    }
                })
                .when('/ideas/:ideasId/admin', {
                    templateUrl: 'app/ideas/admin/admin-list.html',
                    controller: 'IdeasAdminController as admin',
                    title: 'Admin',
                    requireLogin: true,
                    requireAdmin: true,
                    campaign: ROUTE_DETAILS.VALUE_CAMPAIGN_IDEA,
                    resolve: {
                        campaign: function(IdeasCampaignResolver) {
                            return IdeasCampaignResolver.resolve();
                        }
                    }
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
                .when('/help', {
                    templateUrl: 'app/misc/help.html',
                    title: 'Hilfe'
                })
                .when('/imprint', {
                    templateUrl: 'app/misc/imprint.html',
                    title: 'Impressum'
                })
                .when('/privacy', {
                    templateUrl: 'app/misc/privacy.html',
                    title: 'Datenschutzerklärung'
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
