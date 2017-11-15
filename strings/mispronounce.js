'use strict';

var _ = require('underscore');

// Misheard words

// Anamanaguchi
console.log(makeMishearing(
    ['A', 'I', 'U'],
    ['N', 'M', 'G', 'CH']
));

function makeMishearing (vowels, consonants) {
    return _.sample(vowels) +
        _.sample(consonants) +
        _.sample(vowels) +
        _.sample(consonants) +
        _.sample(vowels) +
        _.sample(consonants) +
        _.sample(vowels) +
        _.sample(consonants) +
        _.sample(vowels) +
        _.sample(consonants) +
        _.sample(vowels);
}

// $ node mispronounce.js 
// ANIMUNUCHUCHA

// $ node mispronounce.js 
// ANINUCHINUMA
