'use strict';

const Util = require('./util.js');

let Shot = module.exports = class Shot {
    constructor (type, accuracy, damage, homing) {
        this.type = Shot.Types[type.toUpperCase()];
        if (! this.type) {
            Util.logError(`Shot constructor was given a weird type parameter: ${type}`);
        }

        this.accuracy = accuracy;
        this.damage = damage;
        if (homing) {
            this.homing = homing;
        }
    }

/*  - A shot hits if:
      - // A human is size 10
      - const squadArea = <sum of the sizes of each individual>;
      - // This formula is arbitrary but similar to f(dist) = 1/dist
      - // The +1 to distance is to get a hit rate of around 0.5 at a range of 1 square.
      - // The 100 on the bottom is the squad area of a squad of 10 humans. Balances out the numerator.
      - const shotProbability = (considerCover(squadArea, terrain) + individual.getAccuracy()) / (100 * (distance(shooter, target) + 1));
      - // Where random() is in the range 0 to 1
      - return random() < shotProbability;
      - // Disadvantage of the above: High accuracy and squadArea can push the chance over 1.
      - // Could try a more sigmoid style:
        - squadArea * accuracy / (squadArea * accuracy + distance + 1)
        - Or something
        - In terms of d this is still:
          - f(d) = 1/d
        - But in terms of squadArea and accuracy (saa) this is a diminishing returns or logoid func.
          - f(saa) = saa / (saa + k)
        - So saa provides diminishing returns.
    - hits() should maybe report both the boolean outcome and the shotProbability. Well at least log it.
    */
    hits (distance, targetArea) {
        const advantage = targetArea * this.accuracy;
        const shotProbability = advantage / (advantage + distance + 1);

        Util.logDebug({
            context: `shot.hits()`,
            distance: distance,
            targetArea: targetArea,
            advantage: advantage,
            distance: distance,
            shotDifficulty: shotDifficulty
        });

        return Math.random() < shotProbability;
    }
};

Shot.Types = Util.makeEnum([
    'BULLET',
    'PLASMA',
    'EXPLOSIVE',
    'BEAM',
    'CRYSTAL'
]);
