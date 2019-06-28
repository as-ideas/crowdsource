var angularTranslate = require("angular-translate-extract");

// If custom regex start collect translation keys that actually are not intended, you should create anohter extract task that does the custom regex only on the desired source files!


var data = {
    src: "src/main/resources/public/app/**/*.*",
    dest: "translation",
    prefix: "crowdsource",
    adapter: "pot",
    lang: ["de"],
    customRegex: [
        "title: '(\\w*)'",                                                              // Extract routing titles from crowdsource.js
        "<content-hero[^<>]*title=\"'([^'\"]*)'\"[^<>]*>[^<>]*<\\/content-hero>",       // Extract title from content-hero directives
        "<content-hero[^<>]*description=\"'([^'\"]*)'\"[^<>]*>[^<>]*<\\/content-hero>", // Extract description from content-hero directives
        "<load-more[^]*load-more-label=\"'([^'\"]*)'\"[^]*><\\/load-more>",             // Extract load more label from load-more directives
        "<load-more[^]*no-more-label=\"'([^'\"]*)'\"[^]*><\\/load-more>",               // Extract load no more label from load-more directives
        "<accordion-item[^>]*title=\"'([^'\"]*)'\"[^>]*[>]{1}"                          // Extract title from accordion-item directives
    ]
}

var str = "<content-hero[^]*title=\"'([^'\"]*)'\"[^]*><\\/content-hero>"

var basePath = __dirname.substring(0,__dirname.lastIndexOf('/'));
console.log("basepath: " + basePath);

var option = {
    basePath: basePath
}

angularTranslate.extract(data, option);
