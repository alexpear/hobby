'use strict';

// Todo: const foo = require('./foo.js'); etc


// opts
// - class Squad extends class WNode
//   - Could still have fancy methods...
//   - Would have to be informal inheritance (JS).
//   - Maybe Squad lacks the 'class Squad {...}' syntax
//   - Instead let Squad = module.exports = {...}; ie a object.
//   - Squad.new() instead of a constructor. It contains 'return new WNode('squad');'
//   - or Squad.make(), Squad.makeSquad(), Squad.construct() etc
// - class Squad wraps a WNode which represents a squad
// - class Squad wraps a array of WNode individuals
//   - In this system all WNodes are corporeal objects
//   - Advantage of a Squad class: Can put methods like shoot() and decide() on it.
// - Squad is not a class; instead it's a WNode tree instantiated with static methods

// WNodes represent the light-simulation worldstate. Squads are game units of command.
// When the game has a simplifying abstraction, the Squad stores it and
// the details in the WNode trees are glossed over.
// Squads of one individual are common, such as a assassin or a large monster.
// Similarly, a Squad might contain 1 aircraft with 1 pilot.
// All individuals or vehicles in a Squad must always stay near each other
// in the same grid square.
// However, Squads can split up / bud into 2 Squads, for example
// when a transport vehicle drops off its passengers.

class Squad {
    constructor (coord) {
        this.components = [];
        // this.coord = new Coord(0,0);

        // Later these will be assigned by Replay.
        // Later a team can have more than one ascii color value
        // (eg blue and green vs red and orange)
        this.asciiSprite = '?';
    }

    quantity () {
        const remainingComponents = this.components.filter(
            c => c.status !== WNode.Status.JUNKED
        );

        return remainingComponents ? remainingComponents.length : 0;
    }

    squadArea (terrain) {
        const effectiveSizes = this.components.map(
            component => component.effectiveSize(terrain)
        );

        return Util.sum(effectiveSizes);
    }


    static exampleMarines () {
        let sq = new Squad();
        const squadNode = WNode.exampleNodesFromTerseJson();

        // For now, discard the squadNode and take its components.
        sq.components = squadNode.components;


        return sq;
    }
}
