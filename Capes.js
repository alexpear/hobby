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
profiles.HER_CAPTAIN_AMERICA = new Cape({
    name: 'Captain America',
    ratings: {
        brute: 4,
        blaster: 3,
        mover: 2,
        striker: 1
    },
    allegiance: Allegiance.HERO,
    notes: [
        'Handheld vibranium shield',
        'Uses shield as a thrown weapon. Capable of ricocheting into multiple targets.',
        'Uses small arms weapons',
        'Spycraft training',
        'Close combat training',
        'SHIELD agent',
        'Born in 1919, cryogenically preserved 1945-2011',
        'World\'s first superhero'
    ]
});
profiles.HER_HULK = new Cape({
    name: 'The Incredible Hulk',
    ratings: {
        changer: 5,
        brute: 10,
        mover: 4
    },
    allegiance: Allegiance.HERO,
    notes: [
        'Unchanged form is unpowered but retains invulnerability',
        'Transforms in elevated emotional states',
        'Unpredictable, "berserker" combat style',
        'Powers come from gamma radiation experiment',
        'Mover 4: Jump height of approximately 10 storeys'
    ]
});
profiles.HER_HAWKEYE = new Cape({
    name: 'Hawkeye',
    ratings: {
        tinker: 4,
        blaster: 6,
        mover: 3
    },
    allegiance: Allegiance.HERO,
    notes: [
        'No powers beyond Tinker',
        'Arrow types include: explosive, harpoon, electric',
        'SHIELD agent'
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

