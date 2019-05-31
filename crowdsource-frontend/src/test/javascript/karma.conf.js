module.exports = function (config) {
    config.set({
        basePath: '../../../',

        files: [
            // foundation library is mocked via testsupport/mocked-libraries.testsupport.js
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-dynamic-locale/dist/tmhDynamicLocale.min.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-i18n/angular-locale_de.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-ellipsis/src/angular-ellipsis.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
            'bower_components/angular-translate/angular-translate.min.js',
            'bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'bower_components/ngScrollTo/ng-scrollto.js',
            'bower_components/moment/moment.js',
            'bower_components/moment-timezone/builds/moment-timezone-with-data.js',
            'bower_components/showdown/dist/showdown.min.js',
            'bower_components/ng-showdown/dist/ng-showdown.min.js',
            'bower_components/ng-file-upload/ng-file-upload-all.min.js',
            'bower_components/clipboard/dist/clipboard.min.js',
            'bower_components/ngclipboard/dist/ngclipboard.js',
            'bower_components/Chart.js/Chart.min.js',
            'bower_components/angular-chart.js/dist/angular-chart.min.js',


            // actually, this file would have been picked up by the wildcard pattern app/**/*.js
            // but maybe in a wrong order. crowdsource.js defines the single crowdsource angular module and
            // must come first.
            'src/test/javascript/testsupport/mocked-libraries.testsupport.js',
            'src/main/resources/public/app/crowdsource.js',
            'src/main/resources/public/app/**/*.js',
            'src/main/resources/public/app/translations/de.json',
            'src/main/resources/public/angular/i18n/angular-locale_de.js',
            'src/test/javascript/**/*.js',

            // Selective test execution -> comment line above uncomment lines below
            // 'src/test/javascript/app/user/signup/**/*.js',
            'src/main/resources/public/app/**/*.html'
        ],

        preprocessors: {
            // html->js to make templates available in the tests
            'src/main/resources/public/app/**/*.html': ['ng-html2js']
        },

        // html->js config
        ngHtml2JsPreprocessor: {
            // create one single angular module with the name "templates" where everything gets stores
            moduleName: 'crowdsource.templates',
            // strip off the realtive part of the template path
            stripPrefix: 'src/main/resources/public/'
        },

        client: {
            jasmine: {
                random: false
            }
        },

        frameworks: ['jasmine'],

        browsers: ['PhantomJS2'],

        plugins: [
            'karma-phantomjs2-launcher',
            'karma-ng-html2js-preprocessor',
            'karma-jasmine',
            'karma-jasmine-jquery',
            'karma-junit-reporter'
        ],

        reporters: ['progress', 'junit'],

        junitReporter: {
            outputFile: 'target/surefire-reports/TEST-karma.xml',
            suite: 'karma'
        }
    });
};
