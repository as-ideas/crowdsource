var angularTranslate = require("angular-translate-extract");


var data = {
    src: "src/main/resources/public/app/**/*.html",
    dest: "translation",
    prefix: "crowdsource",
    adapter: "pot",
    lang: ["de"]
}

var basePath = __dirname.substring(0,__dirname.lastIndexOf('/'));
console.log("basepath: " + basePath);
console.log("__dirname: " + __dirname);

var option = {
    basePath: basePath
}

angularTranslate.extract(data, option);