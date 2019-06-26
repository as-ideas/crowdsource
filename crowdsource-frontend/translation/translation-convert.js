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
            let json = JSON.parse(jsonData);
            unescapeChars(json);

            console.log(json);
            fs.writeFileSync(`${destDir}/${file}.json`, JSON.stringify(json));
        } catch (e) {
            console.error(e);
        }
    })
}

let unescapeChars = function(json) {

    for (var key in json) {
        if (json.hasOwnProperty(key)) {

            let text = json[key];
            text = text.replace(new RegExp("\\\\{","g"),"{");
            text = text.replace(new RegExp("\\\\}","g"),"}");

            // Replace within <p> tags all newlines with </br>
            // This is for paragraphs
            // Use cases: Simple formatting of newlines within paragraphs
            text = text.replace(new RegExp("<p>[^<]*<\/p>", "g"), function (match){
                return match.replace(new RegExp("\\n","g"),"</br>");
            })

            // If there are not HTML tags, replace newlines with </br>
            if(text.indexOf("<") === -1 && text.indexOf(">") === -1 && text.indexOf("\n") > -1) {
                console.log(key + ": " + json[key]);
                text = text.replace(new RegExp("\\n","g"),"</br>");
                console.log(key + ": " + text);
            }

            json[key] = text;
        }
    }

}

convert();