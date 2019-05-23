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


files.forEach(function(file) {
    try {
        let jsonData = po2json.parseFileSync(`${baseDir}/${file}.po`, options);
        // do something interesting ...
        console.log(jsonData);
        fs.writeFileSync(`${destDir}/${file}.json`, jsonData);
    } catch (e) {
        console.error(e);
    }
})

