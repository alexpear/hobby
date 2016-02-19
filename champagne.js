// Champagne for my real friends, real pain for my sham friends
// And the relevant xkcd

// phrases['real']['friends'] == 10

var phrases = {};

// Downside of this scheme: can't easily iterate over the word2s.
function addPhrase (word1, word2, weight) {
    weight = weight || 6;

    if (! phrases[word1]) {
        phrases[word1] = {};
    }

    phrases[word1][word2] = weight;
}

addPhrase('sham', 'pain', 8);
addPhrase('real', 'friends', 10);
addPhrase('real', 'pain');
addPhrase('sham', 'friends');

addPhrase('smooth', 'talking', 9);
addPhrase('real', 'talking');
addPhrase('smooth', 'friends');

addPhrase('tumblr', 'weeds', 10);

function quartetScore (a1, a2, b1, b2) {
    return score(a1, a2)
        * score(a1, b2)
        * score(b1, a2)
        * score(b1, b2);
}

function score (word1, word2) {
    if (phrases[word1] && phrases[word1][word2]) {
        return phrases[word1][word2];
    } else {
        return 0;
    }
}



