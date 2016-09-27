'use strict';

var Util = require('./Util.js');

var DIMENSION_NUMBERING = [ 'x', 'y', 'z' ];

module.exports = class Coord {
    constructor (x, y, z) {
        this.x = Util.default(x, 0);
        this.y = Util.default(y, 0);
        this.z = Util.default(z, 0);
    }

    getDim (dimensionNumber) {
        return this[DIMENSION_NUMBERING[dimensionNumber]];
    }

    setDim (dimensionNumber, newVal) {
        this[DIMENSION_NUMBERING[dimensionNumber]] = newVal;
    }

    equals (other) {
        return this.x === other.x
            && this.y === other.y
            && this.z === other.z;
    }

    is (other) { return this.equals(other); }

    plus (other) {
        return new Coord(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
        );
    }

    minus (other) {
        return new Coord(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z
        );
    }

    difference (other) {
        return minus(other);
    }

    distanceTo (other) {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) +
            Math.pow(this.y - other.y, 2) +
            Math.pow(this.z - other.z, 2)
        );
    }

    magnitude () {
        return this.distanceTo(new Coord(0,0,0));
    }

    toString () {
        return '[' + this.x + ',' + this.y + ',' + this.z + ']';
    }
};
