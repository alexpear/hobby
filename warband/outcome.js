'use strict';

// A Replay stores Outcomes to track what happened
// during stochastic events.

// Later could consider making this part of or a superclass of Shot.
let Outcome = module.exports = class Outcome {
    constructor (shot, victim, attacker) {
        // Later there will be more types.
        this.type = 'injury';
        // Later deal with issues of circular reference.
        this.shot = shot;
        this.attacker = attacker && attacker.id;
        this.victim = victim.id;
    }

    static exampleOutcome () {
        return {
            type: 'injury',
            shotTemplate: 'Rifle Bullet',
            attacker: new WNode('marine').id,
            victim: new WNode('marine').id
        };
    }
};
