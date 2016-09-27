'use strict';

// Cube-based 3d puzzles

var _ = require('underscore');

var Coord = require('./Coord.js');
var Shapes = require('./Shapes.js');
var Util = require('./Util.js');

class Quaternion {
    constructor (vector, rotation) {
        this.vector = Util.default(vector, new Coord());
        this.rotation = Util.default(rotation, 0);  // Name may change.
    }

    add (otherQuat) {
        // TODO
    }
}

class Piece {
    constructor (cubes, quaternion, id) {
        // Cubes are arrays like [z, y, x]. They represent 1x1x1 cubes.
        // Coordinates are relative to the Arrangement's origin.
        this.cubes = Util.default(cubes, []);
        this.quaternion = Util.default(quaternion, new Quaternion());
        this.id = Util.default(id, 0);
    }

    translate (vector) {
        this.cubes = this.cubes.map(function (cube) {
            return cube.plus(vector);
        });
    }

    rotate (otherQuat) {
        this.quaternion.add(otherQuat);
    }

    getPositions () {
        // TODO: Return each coord transformed by the quaternion
        return this.cubes;
    }

    boundingBox () {
        return this.getPositions()
            .reduce(
                function (boxSoFar, cube) {
                    return boxSoFar.plusPoint(cube);
                },
                new BoundingBox()
            );
    }

    // The original version of this puzzle fits in a 4x4x4 volume.
    inVolume (sideLength) {
        sideLength = Util.default(sideLength, 4);

        var cubes = this.getPositions();
        for (var i = 0; i < cubes.length; i++) {
            var cube = cubes[i];
            var okay = Util.inRange(cube.x(), 0, sideLength)
                && Util.inRange(cube.y(), 0, sideLength)
                && Util.inRange(cube.z(), 0, sideLength);

            if (! okay) {
                return false;
            }
        }

        return true;
    }

    toString () {
        return new Arrangement([this]).toString();
    }
}

// A set of rotated and positioned Pieces
class Arrangement {
    constructor (shapes, intendedSideLength) {
        // Shapes are 'dehydrated' templates from Shapes.js
        var id = 0;
        this.pieces = shapes.map(function (shape) {
            return new Piece(
                shape.map(function (cube) {
                    return new Coord(cube[0], cube[1], cube[2]);
                }),
                new Quaternion(),
                id++
            );
        });
        this.intendedSideLength = Util.default(intendedSideLength, 4);
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
                    return accumulatedBox.plusBox(pieceBox);
                },
                new BoundingBox()
            );
    }

    cubicVolume () {
        return new BoundingBox(
            new Coord(0, 0, 0),
            new Coord(
                this.intendedSideLength,
                this.intendedSideLength,
                this.intendedSideLength
            )
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
        return this.asLayerString();
    }

    makeRelative (otherCoord) {
        return otherCoord.minus(this.boundingBox().min);
    }

    asLayerString () {
        var BLANK_CHAR = '-';
        var CUBE_CHAR = 'O';
        var arrangement = this;
        var layers = blankLayers();

        this.pieces.forEach(function (piece) {
            piece.getPositions().forEach(function (cube) {
                // TODO: Give each piece a color based on its id.
                var relative = arrangement.makeRelative(cube);
                layers[relative.z][relative.y][relative.x] = piece.id;
            });
        });

        var outString = layers
            .map(function (layer) {
                return layer.map(function (row) {
                    return row.join(' ');
                })
                .join('\n');
            })
            .join('\n\n');

        return outString;

        // LATER can functionize with cubeBuffer()
        function blankLayers () {
            var layers = [];
            var boxVector = arrangement.boundingBox().vector();

            for (var z = 0; z <= boxVector.z; z++) {
                layers.push([]);
                for (var y = 0; y <= boxVector.y; y++) {
                    layers[z].push([]);
                    for (var x = 0; x <= boxVector.x; x++) {
                        layers[z][y].push(BLANK_CHAR);
                    }
                }
            }

            return layers;
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

    cubes () {
        return this.pieces
            .reduce(
                function (cubes, piece) {
                    return cubes.concat(piece.cubes);
                },
                []
            );
    }

    occupied (coord) {
        for (var pi = 0; pi < this.pieces.length; pi++) {
            var piece = this.pieces[pi];
            for (var ci = 0; ci < piece.cubes.length; ci++) {
                if (piece.cubes[ci].equals(coord)) {
                    return true;
                }
            }
        }

        return false;
    }

    empties () {
        var side = this.intendedSideLength;
        var volume = this.cubicVolume();
        var occupiedCells = cubeBuffer(side, false);

        this.cubes().forEach(function (cube) {
            if (volume.contains(cube)) {
                occupiedCells[cube.x][cube.y][cube.z] = true;
            }
        });

        var empties = [];
        for (var x = 0; x < side; x++) {
            for (var y = 0; y < side; y++) {
                for (var z = 0; z < side; z++) {
                    if (! occupiedCells[x][y][z]) {
                        empties.push(new Coord(x, y, z));
                    }
                }
            }
        }

        return empties;
    }

    cubeBuffer (sideLength, initValue) {
        sideLength = Util.default(sideLength, this.intendedSideLength);
        initValue = Util.default(initValue, false);

        var buffer = [];
        for (var x = 0; x < sideLength; x++) {
            buffer.push([]);
            for (var y = 0; y < sideLength; y++) {
                buffer.push([]);
                for (var z = 0; z < sideLength; z++) {
                    buffer.push(initValue);
                }
            }
        }

        return buffer;
    }

    collisions () {
        // LATER: Could be optimized in neatness and runspeed.
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

    outOfBoundsCubes () {
        var volume = this.cubicVolume();
        return this.cubes()
            .filter(function (cube) {
                return ! volume.contains(cube);
            });
    }

    valid () {
        return this.collisions().length === 0
            && this.outOfBoundsCubes().length === 0;
    }

    badness (collisionCost, emptyCost, outOfBoundsCost) {
        collisionCost   = Util.default(collisionCost,   1);
        emptyCost       = Util.default(emptyCost,       1);
        outOfBoundsCost = Util.default(outOfBoundsCost, 1);

        return this.collisions().length * collisionCost
            + this.empties().length * emptyCost
            + this.outOfBoundsCubes().length * outOfBoundsCost;
    }
}

class BoundingBox {
    constructor (min, max) {
        if (min || max) {
            this.min = min;
            this.max = max;
        } else {
            this.min = new Coord(999, 999, 999);
            this.max = new Coord(-999, -999, -999);
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

    contains (coord) {
        for (var d = 0; d < 3; d++) {
            var min = this.min.getDim(d);
            var c = c.getDim(d);
            var max = this.max.getDim(d);

            if (c < min || max < c) {
                return false;
            }
        }

        return true;
    }

    vector () {
        return this.max.minus(this.min);
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
        9
    );
}


// Test calls
var a = new Arrangement(Shapes.pinks);

console.log('-------------------- v json stringify a v');
console.log(JSON.stringify(a, null, '    '));

console.log('-------------------- v Arrangement.toString() v');
console.log(a.toString());

console.log('\n');
console.log(a.collisions().length + ' collisions in a');

console.log('-------------------- v a.boundingBox() v');
var bb = a.boundingBox();
console.log(JSON.stringify(bb, null, '    '));



// Notes
// If Quats get too weird, could probably express rotation as pair of rotations:
// Point the Piece's axis in one of the 6 directions,
// then rotate it 0-3 increments around that axis.
// In other words, (0/1/2/3 around Z axis OR 1/3 around Y axis) THEN 0/1/2/3 around the now-moved X axis.
