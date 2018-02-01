'use strict';

const chalk = require('chalk');

const Coord = require('./coord.js');
const Faction = require('./faction.js');
const Squad = require('./squad.js');
const Util = require('./util.js');

module.exports = class GameState {
    constructor () {
        this.factions = [];
    }

    getFaction (squad) {
        // Later might make use of a id or circular reference.
        return this.factions.find(
            faction => faction.squads.find(
                candidateSquad => candidateSquad === squad
            )
        );
    }

    los (a, b) {
        // Later, actually look at terrain, size, etc
        return true;
    }
}
