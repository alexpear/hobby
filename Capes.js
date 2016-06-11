'use strict'

// Superhero fiction classification functions
// Basically a for-fun library about fictional characters

var Allegiance = module.exports.Allegiance = {
    HERO: 'HER',
    ROGUE: 'ROG',
    VILLAIN: 'VLN',
    UNKNOWN: 'UNK'
}

var Cape = class Cape {
    constructor (name, ratings, allegiance, notes) {
        this.name = name || 'Unidentified Metahuman';
        this.ratings = ratings || {};
        this.allegiance = allegiance || Allegiance.UNKNOWN;
        this.notes = notes || [];
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
);

console.log(JSON.stringify(exports, null, '  '));


