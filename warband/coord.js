'use strict';

const Util = require('./util.js');

module.exports = class Coord {
    constructor (x, y) {
        this.x = Util.default(x, -1);
        this.y = Util.default(y, -1);
    }

    equals (other) {
        return this.x === other.x && this.y === other.y;
    }

    is (other) { return this.equals(other); }

    plus (other) {
        return new Coord(
            this.x + other.x,
            this.y + other.y
        );
    }

    minus (other) {
        return new Coord(
            this.x - other.x,
            this.y - other.y
        );
    }

    distanceTo (other) {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) +
            Math.pow(this.y - other.y, 2)
        );
    }

    // Like distanceTo, but can be off by ~1.
    // Similar to D&D 3.5e diagonals.
    // First measure a 45 degree diagonal (ie NE, NW, SW, or SE) component vector of the desired vector. Measure the longest one that will fit. Then add on a orthagonal (N, W, S, or E) vector. Sum the lengths of those 2 vectors. Assume that is similar to the desired vector (ie to the length of the vector-sum of those vectors).
    // More performant, for Monte Carlo simulations etc.
    approximateDistanceTo (other) {
        const ROOT_TWO = 1.414213562; // TODO double check this

        const xDistance = Math.abs(this.x - other.x);
        const yDistance = Math.abs(this.y - other.y);

        const orthagonalComponent = Math.abs(xDistance - yDistance);
        const diagonalComponent = Math.min(xDistance, yDistance) * ROOT_TWO;

        return orthagonalComponent + diagonalComponent;
    }

    magnitude () {
        return this.distanceTo(new Coord(0, 0));
    }

    isAdjacentTo (other) {
        var distance = this.distanceTo(other);

        // ODDITY: i made the bounds approximate for some reason.
        return 0.9 < distance && distance < 1.5;
    }

    inBox (minCoord, maxCoord) {
        return minCoord.x <= this.x && this.x <= maxCoord.x &&
            minCoord.y <= this.y && this.y <= maxCoord.y;
    }

    toString () {
        return '(' + this.x + ',' + this.y + ')';
    }

    static random (xCount, yCount) {
        if (!xCount || !yCount) {
            Util.logError('Coord.random() called without arguments');
            return new Coord(-1, -1);
            // TODO throw exception, make supervisor reboot, et cetera.
        }

        return new Coord(
            Util.randomUpTo(xCount - 1),
            Util.randomUpTo(yCount - 1)
        );
    }

    static get relatives () {
        return [
            new Coord(-1, -1), new Coord(-1, 0), new Coord(-1, 1),
            new Coord( 0, -1),                   new Coord( 0, 1),
            new Coord( 1, -1), new Coord( 1, 0), new Coord( 1, 1)
        ];
    }

    static randomDirection () {
        return Util.randomOf(Coord.relatives);
    }

    randomAdjacent () {
        do {
            var candidateNeighbor = Coord.randomDirection().plus(this);
        } while (! candidateNeighbor.isInBounds());

        return candidateNeighbor;
    }
};
