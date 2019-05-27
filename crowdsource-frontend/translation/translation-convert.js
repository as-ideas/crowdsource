const po2json = require('po2json');
const fs = require('fs');

let baseDir = __dirname + "/";
let destDir = baseDir + "../src/main/resources/public/translations";

let files = [
    "de",
    "en"
]

let options = {
    stringify: true,
    pretty: true,
    format: 'mf'
}

let convert = function() {
    files.forEach(function(file) {
        try {
            let jsonData = po2json.parseFileSync(`${baseDir}/${file}.po`, options);

            jsonData = unescapeChars(jsonData);
            console.log(jsonData);
            fs.writeFileSync(`${destDir}/${file}.json`, jsonData);
        } catch (e) {
            console.error(e);
        }
    })
}

let unescapeChars = function(text) {
    let newtext;
    newtext = text.replace(/\\\\{\\\\{/g,"{{");
    newtext = newtext.replace(/\\\\}\\\\}/g,"}}");
    return newtext;
}

convert();