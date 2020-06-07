'use strict';

// For pictionary vocab

const fs = require('fs');

class BibleWords {
    static run (filename) {
        // console.log(`top of run()`)
        BibleWords.makeDictionaries(filename);
    }

    static makeDictionaries (filename) {
        const bibleString = fs.readFileSync(filename, { encoding: 'utf8' });

        const alphanumericBible = BibleWords.alphanumericOnly(bibleString);
        const wordArray = alphanumericBible.split(/\s/);

        const commonWords = {}; // TODO

        const dictionary = {};
        const capitalizedDictionary = {};
        
        // console.log(`start of loop`)
        
        for (let word of wordArray) {
            // console.log(`word is ${word}`)

            if (
                ! word ||
                commonWords[word.toLowerCase()] ||
                BibleWords.containsNumbers(word)
            ) {
                continue;
            }

            if (/[A-Z]/.test(word[0])) {
                capitalizedDictionary[word] = true;
            }
            else {
                dictionary[word] = true;
            }

            // console.log(`reached bottom of loop for word "${word}"`)
        }

        // console.log(`end of loop`)

        const capitalizedVocab = Object.keys(
            BibleWords.withoutConjugations(capitalizedDictionary)
        )
        .sort()
        .join(', ');

        const vocab = Object.keys(
            BibleWords.withoutConjugations(dictionary)
        )
        .sort()
        .join(', ');

        console.log(capitalizedVocab + '\n\n' + vocab);
    }

    static containsNumbers (word) {
        return /\d/.test(word);
    }

    static alphanumericOnly (string) {
        return string.replace(/[^\w\s]|_/g, ' ');
    }

    static withoutConjugations (dictionary) {
        const newDictionary = {};

        for (let word in dictionary) {
            // if (dictionary[words + 's'])

            if (word.endsWith('s') && dictionary[word.slice(0, -1)]) {
                // Skip plurals
                console.log(`skipping ${word} because we already have ${word.slice(0, -1)}`);
                continue;
            }

            if ((word.endsWith('es') || word.endsWith('ed')) && dictionary[word.slice(0, -2)]) {
                console.log(`skipping ${word} because we already have ${word.slice(0, -2)}`);
                continue;
            }

            if (word.endsWith('ing') && dictionary[word.slice(0, -3)]) {
                console.log(`skipping ${word} because we already have ${word.slice(0, -3)}`);
                continue;                
            }

            newDictionary[word] = true;
        }

        return newDictionary;
    }
}

BibleWords.FILES = {
    bible: './bible-ukjv-preprocessed.txt',
    dante: './inferno.txt',
    wollstonecraft: './wollstonecraft-rights-of-women.txt',
    wells: './history-of-the-world-wells.txt'
};

BibleWords.run(BibleWords.FILES.dante);

// Corpus ideas
// Frankenstien
// Children's encyclopedia
/* or wikipedia stuff, simple english, wikibooks
newspaper archives / collections
history books? overviews

*/
