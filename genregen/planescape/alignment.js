'use strict';

// Multi-axis alignment system for fantasy fiction
// In the style of Dungeons & Dragons and Planescape

const ALIGNMENTS = {
    Celestia: {
        evilGood: 1,
        lawChaos: -1
    },
    Elysium: {
        evilGood: 1
    },
    Olympia: {
        evilGood: 1,
        lawChaos: 1
    },
    Maelstrom: {
        lawChaos: 1
    },
    Abyss: {
        evilGood: -1,
        lawChaos: 1
    },
    Erebus: {
        evilGood: -1
    },
    Baetor: {
        evilGood: -1,
        lawChaos: -1
    },
    Nirvana: {
        lawChaos: -1
    },
    Sigil: {},
    Human: {
        evilGood: 1,
        lawChaos: -1,
        iceFire: 1,
        deathLife: 1,
        oldNew: 1
    },
    Elf: {
        evilGood: 1,
        lawChaos: -1,
        deathLife: 1,
        oldNew: -1,
        reasonEnergy: -1
    },
    Dwarf: {
        evilGood: 1,
        lawChaos: -1,
        deathLife: 1,
        oldNew: -1,
        reasonEnergy: 1
    }
};

function relationship (a, b) {
    const SHARED_TRAIT_WEIGHT = 2;
    const MISSING_TRAIT_WEIGHT = -1;
    const OPPOSED_TRAIT_WEIGHT = -5;

    let score = 0;

    for (let aAxis in a) {
        const aValue = a[aAxis];
        const bValue = b[aAxis];

        if (aValue === bValue) {
            score += SHARED_TRAIT_WEIGHT;
            // Later, also output the explanations for the score.
        }
        else if (bValue === undefined) {
            score += MISSING_TRAIT_WEIGHT;
        }
        else if (aValue * bValue < 0) {
            score += OPPOSED_TRAIT_WEIGHT;
        }
        else {
            throw new Error(`Unexpected input in function relationship() for ${ aValue } and ${ bValue } on alignment axis ${ aAxis }.`);
        }
    }

    // Also check for traits that only B has.
    for (let bAxis in b) {
        if (a[bAxis] === undefined) {
            score += MISSING_TRAIT_WEIGHT;
        }
    }

    return score;
}

function opinionsOf (protagonist) {
    const others = [];

    for (let otherName in ALIGNMENTS) {
        const other = ALIGNMENTS[otherName];
        const esteem = relationship(protagonist, other);

        others.push({
            name: otherName,
            esteem: esteem
        });
    }

    others.sort((a, b) => b.esteem - a.esteem);

    return others;
}

function test () {
    let output = opinionsOf(ALIGNMENTS.Human);

    console.log(output);
}

// Run
test();


