'use strict';

const moment = require('moment');

const Outcome = require('./outcome.js');
const Util = require('./util.js');

let Event = module.exports = class Event {
    constructor (info) {
        Object.assign(this, info);
        this.timeStamp = moment();

        this.type = Event.Types[info.type];
        if (! this.type) {
            Util.logError(`Event constructed with no recognized type. info is: ${Util.stringify(info)}`);
        }

        // Figure out how to init this later.
        this.outcomes = [];

        this.log();
    }

    log () {
        if (this.type === Event.Types.SHOOT) {
            Util.logEvent(`${this.shootingSquad} is firing at ${this.targetSquad}`);
        }
        else {
            Util.logEvent(`${Util.stringify(this)}`);
        }
    }
};

Event.Types = Util.makeEnum([
    'ARRIVAL',
    'DEPARTURE',
    'MOVE',
    'SHOOT',
    'HIT',
    'DAMAGE',
    'RETREAT',
    'RALLY',
    'SPECIAL'
]);
