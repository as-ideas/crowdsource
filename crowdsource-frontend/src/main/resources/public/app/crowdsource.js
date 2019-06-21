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
                    'ngSanitize', 'ng-showdown', 'ngFileUpload', 'ngclipboard', 'chart.js', 'pascalprecht.translate','tmh.dynamicLocale','angular-google-analytics'])

        .constant('ROUTE_DETAILS', {
            JSON_ROOT: '$$route',
            ATTR_CAMPAIGN: 'campaign',
            ATTR_IS_OVERVIEW: 'isOverview',
            VALUE_CAMPAIGN_IDEA: 'ideas',
            VALUE_CAMPAIGN_PROTOTYPE: 'prototype'
        })

        .config(function ($routeProvider, $locationProvider, $httpProvider, $showdownProvider, $translateProvider, ROUTE_DETAILS, tmhDynamicLocaleProvider,AnalyticsProvider) {

            // Google Analytics
            AnalyticsProvider.setAccount(window.gaId);
            AnalyticsProvider.trackPages(false); // Pages are tracked from nav-bar component after the window title has been set

            // I18n
            var defaultLang = 'de';
            tmhDynamicLocaleProvider.defaultLocale(defaultLang);
            $translateProvider
                .useStaticFilesLoader({
                    prefix: '/translations/',
                    suffix: '.json'
                })
                .preferredLanguage(defaultLang)
                .useMissingTranslationHandlerLog();

            $routeProvider
                .when('/intro', {
                    templateUrl: 'app/intro/intro.html',
                    controller: 'IntroController as intro',
                    title: 'NAV_LABEL_OVERVIEW '
                })
                .when('/ideas/:ideasId', {
                    templateUrl: 'app/ideas/list/ideas-list.html',
                    controller: 'IdeasListController as ideasList',
                    title: 'NAV_LABEL_OVERVIEW',
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
                    title: 'NAV_LABEL_IDEAS_OWN',
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
                    title: 'NAV_LABEL_ADMIN',
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
                    title: 'NAV_LABEL_PROJECTS',
                    showTeaser: true
                })
                .when('/project/new', {
                    templateUrl: 'app/project/form/project-form.html',
                    controller: 'ProjectFormController as projectForm',
                    title: 'NAV_LABEL_PROJECT_NEW',
                    requireLogin: true
                })
                .when('/project/new/:projectId', {
                    templateUrl: 'app/project/form/project-form-success.html',
                    controller: 'ProjectFormSuccessController as projectFormSuccess',
                    requireLogin: true,
                    title: 'NAV_LABEL_PROJECT_ADDED'
                })
                .when('/project/:projectId', {
                    templateUrl: 'app/project/details/project-details.html',
                    controller: 'ProjectDetailsController as projectDetails',
                    title: 'NAV_LABEL_PROJECT_DETAILS'
                })
                .when('/project/:projectId/edit', {
                    templateUrl: 'app/project/form/project-form.html',
                    controller: 'ProjectFormController as projectForm',
                    requireLogin: true,
                    title: 'NAV_LABEL_PROJECT_EDIT'
                })
                .when('/login', {
                    templateUrl: 'app/user/login/user-login.html',
                    controller: 'UserLoginController as login',
                    title: 'NAV_LABEL_LOGIN'
                })
                .when('/signup', {
                    templateUrl: 'app/user/signup/user-signup.html',
                    controller: 'UserSignupController as signup',
                    title: 'NAV_LABEL_REGISTER'
                })
                .when('/signup/:email/:firstName/:lastName/success', {
                    templateUrl: 'app/user/signup/user-signup-success.html',
                    controller: 'UserSignupSuccessController as signupSuccess',
                    title: 'NAV_LABEL_REGISTER_SUCCESS'
                })
                .when('/signup/:email/activation/:activationToken', {
                    templateUrl: 'app/user/activation/user-activation.html',
                    controller: 'UserActivationController as activation',
                    title: 'NAV_LABEL_ACTIVATE'
                })
                .when('/login/password-recovery', {
                    templateUrl: 'app/user/password-recovery/password-recovery.html',
                    controller: 'PasswordRecoveryController as passwordRecovery',
                    title: 'NAV_LABEL_PASSWORD_RECOVERY'
                })
                .when('/login/password-recovery/:email/success', {
                    templateUrl: 'app/user/password-recovery/password-recovery-success.html',
                    controller: 'PasswordRecoverySuccessController as passwordRecoverySuccess',
                    title: 'NAV_LABEL_PASSWORD_RECOVERY_SUCCESS'
                })
                .when('/login/password-recovery/:email/activation/:activationToken', {
                    templateUrl: 'app/user/activation/user-activation.html',
                    controller: 'UserActivationController as activation',
                    title: 'NAV_LABEL_PASSWORD_RESET'
                })
                .when('/financingrounds', {
                    templateUrl: 'app/financing-rounds/financing-rounds.html',
                    controller: 'FinancingRoundsController as financingRounds',
                    title: 'NAV_LABEL_FINANCING',
                    requireLogin: true
                })
                .when('/statistics', {
                    templateUrl: 'app/statistics/statistics.html',
                    controller: 'StatisticsController as statistics',
                    title: 'NAV_LABEL_STATISTIC',
                    requireLogin: true
                })
                .when('/about', {
                    templateUrl: 'app/misc/about.html',
                    title: 'NAV_LABEL_ABOUT_US'
                })
                .when('/help', {
                    templateUrl: 'app/misc/help.html',
                    title: 'NAV_LABEL_HELP'
                })
                .when('/imprint', {
                    templateUrl: 'app/misc/imprint.html',
                    title: 'NAV_LABEL_IMPRINT'
                })
                .when('/privacy', {
                    templateUrl: 'app/misc/privacy.html',
                    title: 'NAV_LABEL_PRIVACY'
                })
                .when('/logout', {
                    templateUrl: 'app/user/logout/user-logout.html',
                    controller: 'UserLogoutController as logout',
                    title: 'NAV_LABEL_LOGOUT'
                })
                .when('/error/notfound', {
                    templateUrl: 'app/error/error-notfound.html',
                    title: 'NAV_LABEL_ERROR_PAGE_NOT_FOUND'
                })
                .when('/error/forbidden', {
                    templateUrl: 'app/error/error-forbidden.html',
                    title: 'NAV_LABEL_ERROR_FORBIDDEN'
                })
                .when('/error/unknown', {
                    templateUrl: 'app/error/error-unknown.html',
                    title: 'NAV_LABEL_ERROR_UNEXPECTED'
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
        })


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
