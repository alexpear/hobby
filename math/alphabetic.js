// What is the longest word in which its letters are in alphabetical order?

var fs = require('fs');

findAlphabeticals();

function findAlphabeticals () {
    var WORDS = '/usr/share/dict/words';

    fs.readFile(WORDS, 'utf8', longestAlphabeticals);
}

function filterAlphabeticals (error, wordsString) {
    return wordsString
        .split('\n')
        .filter(isAlphabetical);
}

function isAlphabetical (word) {
    var cleanedWord = word.toUpperCase();

    for (var w = 1; w < cleanedWord.length; w++) {
        if (cleanedWord[w-1] > cleanedWord[w]) {
            return false;
        }
    }

    return true;
}

function longestAlphabeticals (error, wordsString) {
    var results = filterAlphabeticals(null, wordsString)
        .sort(longer);

    console.log(results);

    return results;
}

function longer (word1, word2) {
    if (word1.length < word2.length) {
        return 1;
    }
    else if (word1.length === word2.length) {
        return 0;
    }
    else {
        return -1;
    }
}
