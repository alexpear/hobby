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
        // TODO
        return [];
    }

    valid () {
        return this.collisions().length === 0;
    }
}
