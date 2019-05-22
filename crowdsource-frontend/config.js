var baseDir = 'src/main',
    scssDir = baseDir + '/scss',
    appDir = baseDir + '/resources/public',
    jsFiles = appDir + '/**/*.js';


var config = {
    baseDir: baseDir,
    scssDir: scssDir,
    appDir: baseDir + '/resources/public',
    jsFiles: appDir + '/**/*.js',
    scssFiles: scssDir + '/**/*.scss',
    resourceFiles: [appDir + '/**/*', '!' + jsFiles],

    jsLibFiles: {
        minified: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-resource/angular-resource.min.js',
            'bower_components/angular-route/angular-route.min.js',
            'bower_components/angular-messages/angular-messages.min.js',
            'bower_components/angular-ellipsis/src/angular-ellipsis.min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
            'bower_components/angular-translate/angular-translate.min.js',
            'bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'bower_components/moment/min/moment.min.js',
            'bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
            'bower_components/bowser/bowser.min.js',
            'bower_components/angulartics/dist/angulartics.min.js',
            'bower_components/showdown/dist/showdown.min.js',
            'bower_components/ng-showdown/dist/ng-showdown.min.js',
            'bower_components/ng-file-upload/ng-file-upload-all.min.js',
            'bower_components/clipboard/dist/clipboard.min.js',
            'bower_components/ngclipboard/dist/ngclipboard.min.js',
            'bower_components/Chart.js/Chart.min.js',
            'bower_components/angular-chart.js/dist/angular-chart.min.js'
        ],
        unminified: [
            'bower_components/foundation/js/vendor/modernizr.js',
            'bower_components/foundation/js/foundation/foundation.js',
            'bower_components/foundation/js/foundation/foundation.tooltip.js',
            'bower_components/foundation/js/foundation/foundation.topbar.js',
            'bower_components/foundation/js/foundation/foundation.equalizer.js',
            'bower_components/foundation/js/foundation/foundation.slider.js',
            'bower_components/angular-i18n/angular-locale_de.js',
            'bower_components/ngScrollTo/ng-scrollto.js',
            'bower_components/foundation-datepicker/js/foundation-datepicker.js'
        ]
    },

    baseDestDir: 'target/classes/public'
};

module.exports = config;
