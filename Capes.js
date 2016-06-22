'use strict'

// Superhero fiction classification functions
// Basically a for-fun library about fictional characters

var _ = require('underscore');

var Allegiance = module.exports.Allegiance = {
    HERO: 'HER',
    ROGUE: 'ROG',
    VILLAIN: 'VLN',
    UNKNOWN: 'UNK'
}

var Cape = class Cape {
    constructor (info) {
        this.name = info.name || 'Unidentified Metahuman';
        this.ratings = info.ratings || {};
        this.allegiance = info.allegiance || Allegiance.UNKNOWN;
        this.notes = info.notes || [];
    }

    toString () {
        // TODO this could be more neat.
        var ratings = this.ratings;
        var ratingsString = Object.keys(this.ratings)
            .map(function (ratingType) {
                // TODO capitalize ratingType.
                return ratingType + ' ' + ratings[ratingType];
            })
            .join(', ');
        return this.name + ': ' + ratingsString;
    }
}
module.exports.Cape = Cape;

var profiles = module.exports.profiles = {};
profiles.HER_CAPTAIN_AMERICA = new Cape(
    'Captain America',
    {
        brute: 4,
        blaster: 3,
        mover: 2,
        striker: 1
    },
    Allegiance.HERO,
    [
        'Handheld vibranium shield',
        'Uses shield as a thrown weapon. Capable of ricocheting into multiple targets.',
        'Uses small arms weapons',
        'Uses spycraft',
        'Close combat training',
        'Born in 1919, cryogenically preserved 1945-2011',
        'World\'s first superhero.'
    ]
});

function sortByType (ratingType) {
    return _.sortBy(profiles, function (cape) {
        return cape.ratings[ratingType];
    });
}

function printCapes (capes) {
    capes.forEach(function (cape) {
        console.log(cape.toString());
    });
}

console.log(JSON.stringify(exports, null, '  '));

console.log();
printCapes(sortByType('blaster'));

