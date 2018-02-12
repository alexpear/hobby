'use strict';

const Coord = require('./coord.js');
const WNode = require('./wnode.js');
const Util = require('./util.js');

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

let Squad = module.exports = class Squad {
    constructor (coord, name) {
        this.components = [];
        this.coord = coord || new Coord(0, 0);
        this.name = name || 'Unknown';
        // Later some unique ID so i can log / event about identical squads.

        // Later these will be assigned by Replay.
        // Later a team can have more than one ascii color value
        // (eg blue and green vs red and orange)
    }

    naiveClaimSprite () {
        this.asciiSprite = this.name[0].toUpperCase();
    }

    quantity () {
        let quantity = this.components.length;
        for (let component of this.components) {
            if (component.status === WNode.Status.JUNKED) {
                quantity -= 1;
            }
        }

        return quantity;
    }

    prettyName () {
        return `${this.name} (${this.asciiSprite})`;
    }

    squadArea (terrain) {
        const effectiveSizes = this.components.map(
            component => component.effectiveSize(terrain)
        );

        return Util.sum(effectiveSizes);
    }

    distanceTo (destination) {
        destination = destination.x ? destination : destination.coord;
        return this.coord.distanceTo(destination);
    }

    shoot () {
        return this.components.reduce(
            (shots, component) => shots.concat(component.shoot()),
            []
        );
    }

    takeCasualty (victim) {
        if (victim.isJunked()) {
            return;
        }

        // Util.logEvent({
        //     context: 'Squad.takeCasualty()',
        //     squad: this.id,
        //     victim: victim.id
        // });

        victim.status = WNode.Status.JUNKED;
    }


    static exampleMarines (quantity) {
        let sq = new Squad(new Coord(11, 11), 'Requiem Veteran Infantry');
        const squadNode = WNode.exampleNodesFromTerseJson(quantity || 10);

        // For now, discard the squadNode and take its components.
        sq.components = squadNode.components;


        return sq;
    }

    static testShots () {
        const shots = Squad.exampleMarines().shoot();
        Util.logDebug(shots);
    }
}

// Squad.testShots();
