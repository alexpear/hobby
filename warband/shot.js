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
};

Shot.Types = Util.makeEnum([
    'BULLET',
    'PLASMA',
    'EXPLOSIVE',
    'BEAM',
    'CRYSTAL'
]);
