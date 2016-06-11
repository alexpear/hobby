// This will later become a module.

var DEFAULT_SEPARATOR = '|';

var exampleHeader = 'magnet|ipfs|seeders|date|size|name';
var exampleLine = '19438GHQE134GHF8O7QASDHFHQ3V9WADFB98SH|QmU5XsVwvJfTcCwqkK1SmTqDmXWSQWaTa7ZcVLY2PDxNxG|68|2016-06-30 1612|202M|Works of William Shakespeare';

function lineAsArray (lineString, separator) {
    separator = separator || DEFAULT_SEPARATOR;
    var BACKSLASH = '\\';

    if (lineString.indexOf(BACKSLASH + separator) > -1) {
        // TODO: Better logging and error handling
        console.log('ERROR: sorry, lineAsArray() doesnt support escaped ' + separator + ' characters inside cells.');
        return;
    } else {
        return lineString.split(separator);
    }
}

function lineAsObject (csvLine, headerStrings, separator) {
    separator = separator || DEFAULT_SEPARATOR;

    var csvCells = lineAsArray(csvLine, separator);
    if (headerStrings.length !== csvCells.length) {
        console.log('ERROR: bad header length passed to lineAsObject()');
        return;
    }

    var output = {};
    for (var i = 0; i < headerStrings.length; i++) {
        output[headerStrings[i]] = csvCells[i];
    }

    return output;
}

function csvStringAsObject (fileString, separator) {
    separator = separator || DEFAULT_SEPARATOR;

    var lines = fileString.split('\n');
    var header = lineAsArray(lines[0]);
    return lines.slice(1).map(function (line) {
        return lineAsObject(line);
    });
}
