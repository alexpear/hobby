'use strict';

const fs = require('fs');
const WORDS_PATH = '/usr/share/dict/words';

class Titles {
    static all (firstLetter) {
        let output = fs.readFileSync(WORDS_PATH, { encoding: 'utf8' })
            .split('\n');

        if (firstLetter) {
            output = output.filter(w => w.startsWith(firstLetter));
        }

        output = output.filter(
            w => Titles.letters(w) === 4
        )
        .map(
            w => `${w[0].toUpperCase()}${w.slice(1)}`
        );

        return Titles.unique(output);
    }

    static letters (word) {
        let total = 0;

        for (const char of word) {
            if (/[a-z]/.test(char.toLowerCase())) {
                total += 1;
            }
        }

        return total;
    }

    static stringify (titles) {
        return titles.join('\n');
    }

    static unique (array) {
        return Array.from(new Set(array));
    }

    static run (firstLetter) {
        const all = Titles.all(firstLetter);
        const output = Titles.stringify(all);
        // const output = all.join(' '); 

        console.log(output);
    }
}

Titles.run('w');
