'use strict';

// Cube-based 3d puzzles

var _ = require('underscore');

class Quaternion {
    constructor (x, y, z, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotation = rotation;  // Name may change.
    }

    add (otherQuat) {
        // TODO
    }
}

class Piece {
    constructor (cubes, quaternion, id) {
        this.cubes = cubes;
        this.quaternion = quaternion;
        this.id = id;
    }

    rotate (otherQuat) {
        this.quaternion.add(otherQuat);
    }

    getPositions () {
        // TODO: Return each coord transformed by the quaternion
        return this.cubes;
    }

    boundingBox () {
        var positions = this.getPositions();

    }
}

// A set of rotated and positioned Pieces
class Arrangement {
    constructor (pieces) {
        this.pieces = pieces;
    }

    ids () {
        return _.pluck(this.pieces, 'id');
    }

    boundingBox () {

    }

    add (newPiece) {
        // TODO: check for id / duplicates perhaps.
        this.pieces.push(newPiece);
    }

    remove (id) {

    }

    render () {
        this.renderAsLayers();
    }

    renderAsLayers () {
        // TODO: take quaternion into account.
        // Get bounding box
        // Set up ascii grid buffers...
        // or something.
    }

    collisions () {
        // TODO Could be optimized in neatness and runspeed.
        var collisions = [];

        for (var pa = 0; pa < this.pieces.length; pa++) {
            // Note: The pb index is always ahead of the pa index.
            for (var pb = pa + 1; pb < this.pieces.length; pb++) {
                var cubesA = this.pieces[pa].getPositions();
                var cubesB = this.pieces[pb].getPositions();

                for (var ca = 0; ca < cubesA.length; ca++) {
                    for (var cb = 0; cb < cubesB.length; cb++) {
                        if (equalPos(cubesA[ca], cubesB[cb])) {
                            collisions.push(cubesA[ca]);
                        }
                    }
                }
            }
        }

        return collisions;
    }

    valid () {
        return this.collisions().length === 0;
    }
}

function equalPos(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

function examplePiece () {
    return new Piece(
        [
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1]
        ],
        new Quaternion(3, 4, 5, 0),
        -1
    );
}


// Test calls
var p = examplePiece();

console.log(JSON.stringify(p, null, '    '));
