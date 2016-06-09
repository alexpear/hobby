// This will later become a module.

var defaultSeparator = '|';

var exampleHeader = 'magnet|ipfs|seeders|date|size|name';
var exampleLine = '19438GHQE134GHF8O7QASDHFHQ3V9WADFB98SH|QmU5XsVwvJfTcCwqkK1SmTqDmXWSQWaTa7ZcVLY2PDxNxG|68|2016-06-30 1612|202M|Works of William Shakespeare';

function lineAsArray (lineString, separator) {
    separator = separator || defaultSeparator;

    if (lineString contains escaped '\|') {

    } else {
        return lineString.split(separator)
    }
}

function headerAsArray (headerString) {

}

function lineAsObject (csvLine, headerInSomeFormat, separator) {
    separator = separator || defaultSeparator;

}
