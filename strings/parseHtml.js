'use strict';

const fs = require('fs');

// Helper funcs for getting info out of HTML files.
class ParseHtml {
    static wikiTitles (path) {
        path = path || './wikipedia-3-vital.txt';

        const lines = fs.readFileSync(path, 'utf8')
            .split('\n');

        const titles = lines.map(
            line => {
                const start = line.indexOf('/wiki/');
                
                const withoutPrefix = line.slice(start);
                // console.log(withoutPrefix);
                const end = withoutPrefix.indexOf('"');
                const title = withoutPrefix.slice(6, end);

                // console.log(title);

                return title.replace(/_/g, ' ')
                    .replace('%27', '\'');
            }
        );

        console.log(titles.length);
        console.log(titles.join('\n'));

        return titles;
    }

    static run () {
        const titles = ParseHtml.wikiTitles();
    }
};

module.exports = ParseHtml;


ParseHtml.run();

