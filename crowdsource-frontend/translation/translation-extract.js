var angularTranslate = require("angular-translate-extract");

// If custom regex start collect translation keys that actually are not intended, you should create anohter extract task that does the custom regex only on the desired source files!


var data = {
    src: "src/main/resources/public/app/**/*.*",
    dest: "translation",
    prefix: "crowdsource",
    adapter: "pot",
    lang: ["de"],
    customRegex: [
        "title: '(\\w*)'" // This regex collects routing titles from crowdsource.js
    ]
}

var basePath = __dirname.substring(0,__dirname.lastIndexOf('/'));
console.log("basepath: " + basePath);

var option = {
    basePath: basePath
}

angularTranslate.extract(data, option);
