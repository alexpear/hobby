// vowel variety in words

var _ = require('underscore');
var fs = require('fs');

var ALWAYS_VOWELS = [
  'A', 'E', 'I', 'O', 'U'
];

var ALWAYS_CONSONANTS = [
  'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
  'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'
];

function withEnoughVowels(strings, minVowelVariety) {
  return strings.filter(function(str) {
    return vowelVariety(str) >= minVowelVariety;
  });
};

function vowelVariety(str) {
  return vowelTypesIn(str).length;
};

function vowelTypesIn(str) {
  str = str.toUpperCase();

  var presentVowels = ALWAYS_VOWELS.filter(function(vowel) {
    return _.contains(str, vowel);
  });

  if (containsYVowel(str)) {
    return presentVowels.concat('Y');
  } else {
    return presentVowels;
  }
};

function containsYVowel(str) {
  str = str.toUpperCase();

  var yIndexs = [];
  str.split('')
    .forEach(function(char, index) {
      if (char == 'Y' && isYVowel(index, str)) {
        yIndexs.push(index);
      }
    });

  return yIndexs.length > 0;
}

/* Cases
true:  [anything] Y
true:  [anything] Y [conso] DAYTIME HOYT BOYHOOD
true?: [conso] Y [vowel] CYAN NYET UNYOKED
false: [vowel] Y [vowel]
false: Y [vowel]
*/
function isYVowel(yIndex, str) {
  var prevChar = str[yIndex - 1];
  var nextChar = str[yIndex + 1];

  // Consonant Ys are always followed by AEIOU.
  if (! isCoreVowel(nextChar)) {
    return true;
  }

  // Tricky case. CYAN NYET UNYOKED NONYELLOW... Assume vowel.
  else if (isCoreConsonant(prevChar)) {
    return true;
  }

  // In rare case of adjacent Ys, count both as vowels.
  else if ('Y' == prevChar) {
    return true;
  }

  // Y-consonant followed by a vowel
  else {
    return false;
  }
};

function isCoreConsonant (char) {
  return _.contains(ALWAYS_CONSONANTS, char);
};

function isCoreVowel(char) {
  return _.contains(ALWAYS_VOWELS, char);
};



// run
var wordsPath = '/usr/share/dict/words';
fs.readFile(wordsPath, 'utf8', function (err, words) {
  if (err) { return console.log(err); }

  console.log('before withEnoughVowels');
  var varietousWords = withEnoughVowels(words.split('\n'), 4);
  console.log('varietousWords length is ' + varietousWords.length);

  varietousWords.forEach(function(word) {
    console.log(word);
    // console.log(vowelTypesIn(word));
  });
});

console.log('after readfile');



// tests
// console.log(isCoreVowel('E'));
// console.log(isCoreVowel('Q'));
// console.log(isCoreConsonant('E'));
// console.log(isCoreConsonant('Q'));

// console.log(containsYVowel('EASY'));
// console.log(containsYVowel('YOUNG'));

// console.log(vowelTypesIn('YOUNG'));
// console.log(vowelVariety('YOUNG'));
// console.log(withEnoughVowels(['YOUNG', 'EASY'], 3));
