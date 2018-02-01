'use strict';

const chalk = require('chalk');

const Coord = require('./coord.js');
const Faction = require('./faction.js');
const Squad = require('./squad.js');
const Util = require('./util.js');

module.exports = class GameState {
    constructor () {
        this.factions = [];
    }

    getFaction (squad) {
        // Later might make use of a id or circular reference.
        return this.factions.find(
            faction => faction.squads.find(
                candidateSquad => candidateSquad === squad
            )
        );
    }

    los (a, b) {
        // Later, actually look at terrain, size, etc
        return true;
    }

    canShoot (shootingSquad, targetSquad) {
        // Later, if same faction, reject.
        if (! this.los(shootingSquad, targetSquad)) {
            // Later maybe return { canShoot: false, reason: 'los' }
            return false;
        }
    }

    shoot (shootingSquad, targetSquad) {
        if (! this.canShoot(shootingSquad, targetSquad)) {
            Util.log('shoot() was called while canShoot() was false', 'error');
            return;
        }

        // Later, consider adding 40k restriction about being tempted to choose closest enemy target

        /*
        Shooting outline
        - <trimmed>
        - Probably as part of the same calculation, check cover
          - Intervening and from the terrain type in the target's square
          - Later figure out the rules for soft cover (occludes but does not block shots).
            - For now just consider it weaker hard cover
          - The effect of cover is probably:
            - Treat the target individuals as if they had smaller .size values.
        - Instantiate shotSet consisting of n Shots from each shooting weapon
        - Roll for the accuracy of each Shot
          - params that increase likelihood it will hit a individual in the target squad:
            - .accuracy of the weapon
                - Also homing, soldier aim bonuses, etc
            - sum ( size of each individual shrunk by cover ) represents the squad's target area
          - params that decrease likelihood of a hit
            - distance between shooter and target
              - Maybe in the same proportions as a circle-arc / radius-area sim, etc
          - preferably quasi sigmoid: hitting and missing are always both possible.
        - 2 options for how we will do shot distribution
          - Sim: Each shot hits a random individual, proportional to its modified size
            - Accidental overkill is possible: 2 lethal shots hit the same soldier
            - With this, i might have to add rules for a survivor automatically
              picking up the flamer after the flamer-carrier is shot.
          - 40k: Each shot hits 1 individual, hitting the least-points ones first
            - Leaves the officers and special equipment soldiers last
        - Roll for damage i guess
          - For now, each individual is either healthy or a casualty
          - Later, individuals can get Damage debuffs such as Limping
        - Later, morale rules.
          - Maybe the test is taken right before the damaged squad's next activation
          - Requires the squad to remember how many casualties it took recently.

        - A shot hits if:
          - // A human is size 10
          - const squadArea = <sum of the sizes of each individual>;
          - // This formula is arbitrary but similar to f(dist) = 1/dist
          - // The +1 to distance is to get a hit rate of around 0.5 at a range of 1 square.
          - // The 100 on the bottom is the squad area of a squad of 10 humans. Balances out the numerator.
          - const shotDifficulty = (considerCover(squadArea, terrain) + individual.getAccuracy()) / (100 * (distance(shooter, target) + 1));
          - // Where random() is in the range 0 to 1
          - return random() < shotDifficulty;
          - // Disadvantage of the above: High accuracy and squadArea can push the chance over 1.
          - // Could try a more sigmoid style:
            - squadArea * accuracy / (squadArea * accuracy + distance + 1)
            - Or something
            - In terms of d this is still:
              - f(d) = 1/d
            - But in terms of squadArea and accuracy (saa) this is a diminishing returns or logoid func.
              - f(saa) = saa / (saa + k)
            - So saa provides diminishing returns.

        - A hit does damage if:
          - const damageDiff = shot.damage - victim.durability + getDamageModifier(); // Can be negative, zero, or positive.
          - const SCALING = 0.5; // Or something, to make the probabilities feel right
          - const exponentiated = Math.pow(2, SCALING * damageDiff);
          - // quasi sigmoid probability curve between 0 and 1.
          - const damageChance = exponentiated / (exponentiated + 1);
          - return random() < damageChance;
        - Damage for now means the individual (victim) is converted from a combatant to a casualty.
        */
    }


};
