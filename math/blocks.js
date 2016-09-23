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
        var box = newBoundingBox();

        this.getPositions().forEach(function (cube) {
            for (var d = 0; d < box.min.length; d++) {
                var dimensionCoordinate = cube[d];
                if (dimensionCoordinate < box.min[d]) {
                    box.min[d] = dimensionCoordinate;
                }
                if (box.max[d] < dimensionCoordinate) {
                    box.max[d] = dimensionCoordinate;
                }
            }
        });

        return box;
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
        return this.pieces
            .map(function (piece) {
                return piece.boundingBox();
            })
            .reduce(
                function (accumulatedBox, pieceBox) {
                    for (var d = 0; d < pieceBox.min.length; d++) {
                        if (pieceBox.min[d] < accumulatedBox.min[d]) {
                            accumulatedBox.min[d] = pieceBox.min[d];
                        }
                        if (accumulatedBox.max[d] < pieceBox.max[d]) {
                            accumulatedBox.max[d] = pieceBox.max[d];
                        }
                    }
                },
                newBoundingBox()
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
            var relCoord = [0, 0, 0];

            // TODO: Replace with Coord.minus() later.
            for (var d = 0; d < coord.length; d++) {
                relCoord[d] = coord[d] - box.min[d];
            }

            return relCoord;
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

// TODO Utils module?
var COLORS = [
    '1;37;40m',
    '1;37;41m',
    '1;30;42m',
    '1;37;43m',
    '1;37;44m',
    '1;37;45m',
    '1;30;46m',
    '1;30;47m'
];

function equalPos (a, b) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

// TODO write class BoundingBox
// with function engulf(other)
function newBoundingBox () {
    return {
        min: [999, 999, 999],
        max: [-999, -999, -999]
    };
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



// Notes
// If Quats get too weird, could probably express rotation as pair of rotations:
// Point the Piece's axis in one of the 6 directions,
// then rotate it 0-3 increments around that axis.
// In other words, (0/1/2/3 around Z axis OR 1/3 around Y axis) THEN 0/1/2/3 around the now-moved X axis.
