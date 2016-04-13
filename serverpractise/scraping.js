// scraping webcomics

var fs = require('fs');
var request = require('request');

var URI_BASE = 'http://sssscomic.com/comicpages/'
var LAST_PAGE = 510;

for (var pg=0; pg<=LAST_PAGE; pg++) {
    grabPage(pg);
}

function grabPage (n) {
    var fileName = n + '.jpg';
    fs.stat(fileName, function (error, statObj) {
        if (error === null) {
            console.log(fileName + ' already exists');
        }
        else if (error.code === 'ENOENT') {
            var uri = URI_BASE + fileName;
            console.log(uri);
            requestPage(uri, fileName);
        }
        else {
            console.log(error.code);
        }
    });
}

function requestPage (uri, fileName) {
     request(uri, { encoding: 'binary' }, function (error, response, body) {
        if (error) { return console.log(error); }
        if (response.statusCode != 200) { return console.log(response.statusCode); }

        fs.writeFile('./' + fileName, body, 'binary', function(error) {
            if(error) { return console.log(error); }
            console.log("wrote file " + fileName);
        });
    });
}







