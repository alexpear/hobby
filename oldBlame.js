// Input git blame dump, output only the oldest lines.
// Probably only works for some git blame format settings.

var fs = require('fs');

var summary = findOldLines(process.argv[2], process.argv[3], process.argv[4]);
if (summary) {
    console.log(summary);
}

function findOldLines (filename, threshold, chronological) {
    if (! filename) {
        console.log('usage: git blame foo.js > blame_dump_file.txt\n' +
            'then:  node oldBlame.js blame_dump_file.txt [threshold_date] [chronological]');
        return;
    }

    threshold = threshold || '2015-08-01';

    var blameFile = fs.readFileSync(filename);
    var lines = blameFile
        .toString()
        .split('\n')
        .map(function (line) {
            var dateIndex = line.indexOf(' 201') + 1;
            return {
                text: line,
                date: line.slice(dateIndex, dateIndex + 10)
            };
        })
        .filter(function (line) {
            return line.date <= threshold;
        });

    if (chronological) {
        lines = lines.sort(compareDates);
    }

    return sparseLinesToString(lines);
}

function compareDates (line1, line2) {
    if (line1.date > line2.date) {
        return 1;
    } else if (line1.date === line2.date) {
        return 0;
    } else {
        return -1;
    }
}

function sparseLinesToString (lineObjects) {
    for (var i = 0; i < lineObjects.length; i++) {
        var curObject = lineObjects[i];
        curObject.lineNumber = parseInt(curObject.text.slice(57, 61));

        // If next line is not adjacent
        if (0 < i && lineObjects[i - 1].lineNumber + 1 !== curObject.lineNumber) {
            curObject.text = '\n' + curObject.text;
        }
    }

    return lineObjects
        .map(function (lineObject) {
            return lineObject.text;
        })
        .join('\n');
}
