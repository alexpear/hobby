'use strict';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VOWELS = 'AEIOUY';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXZ';

const fs = require('fs');
const WORDS_PATH = '/usr/share/dict/words';

const QUICK_BROWN_FOX = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
const SPHINX = 'SPHINX OF BLACK QUARTZ, JUDGE MY VOW';


printAnalysis(analysis(SPHINX));
printAnalysis(analysis(' QUARK SPHINX WYVERN'));
printAnalysis(analysis('SCHMALTZ'));
printAnalysis(analysis('QUANT MR SPLOTCH'));

console.log(
    notContaining(
        consonantfulWords(),
        'splotch'
    )
);

function analysis (sentence) {
    const cleanSentence = sentence.replace(/[^A-z]/g, '')
        .toUpperCase();

    return {
        input: sentence,
        inefficiency: cleanSentence.length - ALPHABET.length,
        missing: missing(cleanSentence) || 'Nothing missing.',
        duplicates: prettyDuplicates(cleanSentence)
    };
}

// Returns string
function missing (sentence) {
    return ALPHABET.split('')
        .filter(
            letter => sentence.indexOf(letter) === -1
        )
        .join('');
}

// Returns string
function prettyDuplicates (str) {
    return duplicates(str)
        .sort()
        .join(' ') || 'No duplicates.';
}

// Returns string[]
function duplicates (str) {
    let instancesOf = {};
    for (let i = 0; i < str.length; i++) {
        let letter = str[i];
        if (instancesOf[letter]) {
            instancesOf[letter] += 1;
        }
        else {
            instancesOf[letter] = 1;
        }
    }

    return Object.keys(instancesOf)
        .filter(
            letter => instancesOf[letter] > 1
        )
        .map(
            // When value is 3, output is 'XXX' etc
            // Idiom for string replication.
            letter => Array(instancesOf[letter]).join(letter)
        );
}

function duplication (str) {
    return duplicates(str).join('').length;
}

function printAnalysis (analysis) {
    console.log();

    Object.keys(analysis)
        .map(trait => `${ trait }: ${ analysis[trait] }`)
        .forEach(line => console.log(line));

    console.log();
}

function consonantfulWords () {
    const WORDS = fs.readFileSync(WORDS_PATH, { encoding: 'utf8' })
        .split('\n');

    return WORDS.filter(
        word => consonantRatio(word) >= 5 &&
            word.length > 1 &&
            duplication(word) <= 0
    );
}

// High is usually bad i think.
function consonantRatio (word) {
    word = word.toUpperCase();

    let vowelCount = 0;
    let consonantCount = 0;
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (VOWELS.indexOf(letter) >= 0) {
            vowelCount += 1;
        }
        else {
            consonantCount += 1;
        }
    }

    return consonantCount / (vowelCount || 0.01);
}

const EFFICIENT_WORDS = [
    'borscht',
    'bortsch',
    'cwm',
    'Mr',
    'Mrs',
    'nth',
    'pschent',
    'pst',
    'schmaltz',
    'schmelz',
    'Schrund',
    'schwarz',
    'sh',
    'splatch',
    'splotch',
    'st',
    'tch',
    'tck',
    'Td',
    'th' 
];

function notContaining (words, blacklist) {
    blacklist = blacklist.toUpperCase();

    return words.filter(
        word => {
            word = word.toUpperCase();
            for (let i = 0; i < blacklist.length; i++) {
                if (word.indexOf(blacklist[i]) >= 0) {
                    return false;
                }
            }

            return true;
        }
    );
}

// Score a word based on a weighted sum of its impact to the sentence's missings, duplicates, and vowel ratio among the missings.
function suitability(word, sentence) {
    word = word.toUpperCase();
    sentence = sentence.toUpperCase();
    const combined = sentence + ' ' + word;

    const intersect = intersection(word, sentence);
    const duplicateScore = -1 * intersect.length;

    const oldMissing = missing(sentence);
    const newMissing = missing(combined);
    const missingReduction = uniqueIntersection(oldMissing, word).length;
    const missingScore = 1 * missingReduction;

    const oldMissingRatio = consonantRatio(oldMissing);
    const newMissingRatio = consonantRatio(newMissing);
    const consonantRatioScore = 1 * (oldMissingRatio - newMissingRatio);

    const suit = duplicateScore + missingScore + consonantRatioScore;

    console.log(`word: ${word}, sentence: ${sentence}`);
    console.log(`duplicateScore: ${duplicateScore}, missingScore: ${missingScore}, consonantRatioScore: ${consonantRatioScore}`);
    console.log(`...total suitability: ${suit}`);

    return suit;
}

// Params string, string
// Ignores duplicates within each word
function uniqueIntersection (a, b) {
    const aSet = new Set(a.split(''));
    const bSet = new Set(b.split(''));

    const intersect = new Set(
        [...aSet].filter(
            e => bSet.has(e)
        )
    );

    return [...intersect].join('');
}

// Params string, string
function intersection (a, b) {
    const intersect = a.split('')
        .filter(
            e => b.indexOf(e) >= 0
        )
        .join('');

    return intersect;
}

console.log(suitability('I QUANT', 'MR SPLOTCH'))

