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
            Util.log('Coord.random() called without arguments', 'error');
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
