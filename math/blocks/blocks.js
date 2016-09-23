'use strict';

// Cube-based 3d puzzles

var _ = require('underscore');

var Coord = require('./Coord.js');
var Util = require('./Util.js');

class Quaternion {
    constructor (vector, rotation) {
        this.vector = vector;
        this.rotation = rotation;  // Name may change.
    }

    add (otherQuat) {
        // TODO
    }
}

class Piece {
    constructor (cubes, quaternion, id) {
        // Cubes are arrays like [z, y, x]. They represent 1x1x1 cubes.
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
        var box = new BoundingBox();

        return this.getPositions()
            .reduce(
                function (boxSoFar, cube) {
                    return boxSoFar.plusPoint(cube);
                },
                new BoundingBox()
            );
    }

    toString () {
        // todo
    }
}

// TODO: Need to re-think how to store Piece translations.
// Store each piece in its own 0,0,0-relative space, plus quat + translation?
// Or store each piece as a set of cubes with already-transformed cubes,
// relative to the Arrangement's origin?

// A set of rotated and positioned Pieces
class Arrangement {
    constructor (pieces) {
        this.pieces = pieces;
    }

    ids () {
        return _.pluck(this.pieces, 'id');
    }

    boundingBox () {
        return this.pieces
            .map(function (piece) {
                return piece.boundingBox();
            })
            .reduce(
                function (accumulatedBox, pieceBox) {
                    // for (var d = 0; d < pieceBox.min.length; d++) {
                    //     if (pieceBox.min[d] < accumulatedBox.min[d]) {
                    //         accumulatedBox.min[d] = pieceBox.min[d];
                    //     }
                    //     if (accumulatedBox.max[d] < pieceBox.max[d]) {
                    //         accumulatedBox.max[d] = pieceBox.max[d];
                    //     }
                    // }
                },
                new BoundingBox()
            );
    }

    add (newPiece) {
        // TODO: check for id / duplicates perhaps.
        this.pieces.push(newPiece);
    }

    remove (id) {
        // todo
    }

    toString () {
        this.asLayerString();
    }

    asLayerString () {
        // TODO: take quaternion into account.
        var box = this.boundingBox();

        // Set up ascii grid buffers...
        var grids = [];
        for (var z = box.min[0]; z <= box.max[0]; z++) {
            grids.push([]);
            for (var y = box.min[1]; y <= box.max[1]; y++) {
                // TODO: difference between box-relative and absolute coords.
                // grids[z].push([]);
                // for (var x = box.min[2]; x <= box.max[2]; x++) {
                //     grids[z][y].push(' ');
                // }
            }
        }

        this.pieces.forEach(function (piece) {

        });

        return grids;

        // box.min -> [0, 0, 0]
        // box.min [11, 12, 13] & coord [16, 15, 14] -> relCoord [5, 3, 1]
        function relativeToBox (coord, box) {
            return coord.minus(box.min);
        }
    }

// var EXAMPLE_GRIDS = [
//     [
//         [' ', ' ', ' '],
//         [' ', ' ', ' '],
//         [' ', ' ', ' ']
//     ],
//     [
//         [' ', ' ', ' '],
//         [' ', ' ', ' '],
//         [' ', ' ', ' ']
//     ],
//     [
//         [' ', ' ', ' '],
//         [' ', ' ', ' '],
//         [' ', ' ', ' ']
//     ]
// ];

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
                        if (cubesA[ca].equals(cubesB[cb])) {
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

class BoundingBox {
    constructor (min, max) {
        if (! min && ! max) {
            this.min = new Coord(999, 999, 999);
            this.max = new Coord(-999, -999, -999);
        } else {
            this.min = min;
            this.max = max;
        }
    }

    plusPoint (otherPoint) {
        var outBox = new BoundingBox();
        for (var d = 0; d < 3; d++) {
            var existingMin = this.min.getDim(d);
            var existingMax = this.max.getDim(d);
            var otherCoordinate = otherPoint.getDim(d);

            var newMin = (existingMin <= otherCoordinate)
                ? existingMin
                : otherCoordinate;
            var newMax = (existingMax <= otherCoordinate)
                ? otherCoordinate
                : existingMax;

            outBox.min.setDim(d, newMin);
            outBox.max.setDim(d, newMax);
        }

        return outBox;
    }

    plusBox (newBox) {
        return this
            .plusPoint(newBox.min)
            .plusPoint(newBox.max);
    }
}

function examplePiece () {
    return new Piece(
        [
            new Coord (0, 0, 0),
            new Coord (0, 0, 1),
            new Coord (0, 1, 0),
            new Coord (0, 1, 1)
        ],
        new Quaternion(
            new Coord(3, 4, 5),
            0
        ),
        -1
    );
}


// Test calls
var p = examplePiece();
console.log(JSON.stringify(p, null, '    '));

var bb = p.boundingBox();
console.log(JSON.stringify(bb, null, '    '));



// Notes
// If Quats get too weird, could probably express rotation as pair of rotations:
// Point the Piece's axis in one of the 6 directions,
// then rotate it 0-3 increments around that axis.
// In other words, (0/1/2/3 around Z axis OR 1/3 around Y axis) THEN 0/1/2/3 around the now-moved X axis.
