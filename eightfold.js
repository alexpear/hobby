'use strict';

const Util = require('./util.js');

class Eightfold {
    static syllables () {
        return [
            'av',
            'ko',
            'du',
            'si',
            'te',
            'mu',
            'nor',
            'ly',
        ];
    }

    static allPairs () {
        for (let a of Eightfold.syllables()) {
            for (let b of Eightfold.syllables()) {
                const name = Util.capitalized(a + b);

                console.log(name);
            }
        }
    }

    static randomWord (syllables) {
        let word = '';

        for (let i = 0; i < syllables; i++) {
            word += Util.randomOf(Eightfold.syllables());
        }

        return Util.capitalized(word);
    }

    static randomPerson () {
        return Eightfold.randomWord(4) + ' ' + Eightfold.randomWord(3);
    }

    static run () {
        for (let i = 0; i < 40; i++) {
            const output = Eightfold.randomPerson();

            console.log(output);
        }
    }
}

module.exports = Eightfold;

Eightfold.run();

