'use strict';

const chalk = require('chalk');

const Coord = require('./coord.js');
const Event = require('./event.js');
const Faction = require('./faction.js');
const Outcome = require('./outcome.js');
const Squad = require('./squad.js');
const Terrain = require('./terrain.js');
const Util = require('./util.js');

// Educational note: The name of the class does not reach this file's scope.
let GameState = module.exports = class GameState {
    constructor (stepCount) {
        this.stepCount = stepCount || 0;
        // Opts
        // - gameState has .factions which themselves have .squads
        // - gamestate has .squads, which each has a .faction (pointer or id) field
        this.squads = [];
        this.terrainGrid = GameState.exampleTerrainGrid();
        this.xMax = this.terrainGrid.length;
        this.yMax = this.terrainGrid[0].length;
        this.eventHistory = [];
    }

    getFaction (squad) {
        // Later might make use of a id or circular reference.
        // This might be obsolete later.
        return this.factions.find(
            faction => faction.squads.find(
                candidateSquad => candidateSquad === squad
            )
        );
    }

    terrainAt (coord) {
        return this.inBounds(coord) ?
            this.terrainGrid[ coord.x ][ coord.y ] :
            undefined;
    }

    inBounds (coord) {
        return Util.inBox(coord, new Coord(0, 0), new Coord(this.xMax, this.yMax));
    }

    los (aCoord, bCoord) {
        // Later, actually look at terrain, size, etc
        return true;
    }

    canShoot (shootingSquad, targetSquad) {
        // Later, if same faction, reject.
        if (! this.los(shootingSquad, targetSquad)) {
            // Later maybe return { canShoot: false, reason: 'los' }
            return false;
        }

        // Later, consider the case of cover that completely obscures target and prevents shooting.
        // Eg hills, walls, etc.
        return true;
    }

    announceEvent (info) {
        const event = new Event(info);
        this.eventHistory.push(event);
        // Later decide whether eventHistory will be on GameState or Replay.
    }

    shoot (shootingSquad, targetSquad) {
        if (! this.canShoot(shootingSquad, targetSquad)) {
            Util.logError('shoot() was called while canShoot() was false');
            return;
        }

        // Later, consider adding 40k restriction about being tempted to choose closest enemy target

        const distance = shootingSquad.distanceTo(targetSquad);

        // Later, will also need to look at the intervening terrain. Also altitude: hills/towers.
        const targetArea = targetSquad.squadArea(
            this.terrainAt(targetSquad.coord)
        );

        this.announceEvent({
            type: Event.Types.SHOOT,
            shootingSquad: shootingSquad.prettyName(),
            targetSquad: targetSquad.prettyName()
        });

        const shotSet = shootingSquad.shoot();
        Util.logDebug({
            context: 'gameState.shoot()',
            shots: shotSet.length
        });

        const hits = shotSet.filter(
            shot => shot.hits(distance, targetArea)
        );

        Util.logDebug({
            context: 'gameState.shoot()',
            hits: hits.length
        });

        let outcomes = [];
        for (let i = 0; i < hits.length; i++) {
            const shot = hits[i];
            const victim = nextVictim(targetSquad, targetArea);
            if (damages(shot, victim)) {
                // Later track who the attacker (firer) of the shot was, somehow.
                outcomes.push(new Outcome(shot, victim));
            }
        }

        Util.logDebug({
            context: 'gameState.shoot()',
            outcomesLength: outcomes.length
        });

        Util.logDebug({
            context: 'gameState.shoot()',
            outcomes: outcomes
        });


        // This could become a member of class Squad.
        // However, note that it will later also take input about homing and careful aim.
        function nextVictim (targetSquad, squadArea) {
            squadArea = squadArea || targetSquad.squadArea();

            // The shot is assigned to a random victim in the squad.
            // Squad members are weighted by their size.
            // The assginmentRoll indicates which one is hit.
            let assignmentRoll = Math.random() * squadArea;
            let victim = targetSquad.components[0];
            for (let targetIndividual of targetSquad.components) {
                // We use iterative subtraction as a quick way to find which member
                // is indicated by the assignmentRoll.
                assignmentRoll -= targetIndividual.size;
                if (assignmentRoll < 0) {
                    victim = targetIndividual;
                    break;
                }
            }

            return victim;
        }

        // This function could be moved later.
        function damages (shot, victim) {
            // Damage for now means the individual (victim) is converted from a combatant to a casualty.
            const damageDiff = shot.damage - victim.durability + getDamageModifier(shot, victim);
            const SCALING = 0.5; // To make the probabilities feel right

            // quasi sigmoid probability curve between 0 and 1.
            const exponentiated = Math.pow(2, SCALING * damageDiff);
            const damageChance = exponentiated / (exponentiated + 1);
            return Math.random() < damageChance;
        }

        // Dummy function.
        // Later move to Gamestate, Squad, or WNode
        function getDamageModifier (shot, victim) {
            return 0;
        }

        /*
        Shooting outline
        - <trimmed>
        - 2 options for how we will do shot distribution
          - Sim: Each shot hits a random individual, proportional to its modified size
            - Accidental overkill is possible: 2 lethal shots hit the same soldier
            - With this, i might have to add rules for a survivor automatically
              picking up the flamer after the flamer-carrier is shot.
            - What is the computationally quickest way to calc that?
            - Tournament array: Set up a array with 1 element per size point per
              individual in the target squad.
            - Then assign each shot (after rolling if it hits, i think) to a
              random individual using this 'weighted array'.
            - This is basically spending space to save time.
            - This should be cheap, because squads have < 20 individuals
              and because the array is garbage collected after each shot pool.
            - We could probably optimize that. Basically set up any data structure
          - 40k: Each shot hits 1 individual, hitting the least-points ones first
            - Leaves the officers and special equipment soldiers last
        - Roll for the accuracy of each Shot
          - params that increase likelihood it will hit a individual in the target squad:
            - .accuracy of the weapon
                - Also homing, soldier aim bonuses, etc
            - sum ( size of each individual shrunk by cover ) represents the squad's target area
          - params that decrease likelihood of a hit
            - distance between shooter and target
              - Maybe in the same proportions as a circle-arc / radius-area sim, etc
          - preferably quasi sigmoid: hitting and missing are always both possible.
        - Roll for damage i guess
          - For now, each individual is either healthy or a casualty
          - Later, individuals can get Damage debuffs such as Limping
        - Later, morale rules.
          - Maybe the test is taken right before the damaged squad's next activation
          - Requires the squad to remember how many casualties it took recently.
        */
    }


    static testShooting () {
        let gameState = new GameState();
        gameState.squads = [
            Squad.exampleMarines(),
            Squad.exampleMarines()
        ];

        gameState.squads[0].name = 'unscSquad';
        gameState.squads[0].naiveClaimSprite();
        gameState.squads[1].name = 'innieSquad';
        gameState.squads[1].naiveClaimSprite();
        gameState.squads[1].coord = new Coord(10, 0);

        gameState.shoot(
            gameState.squads[0],
            gameState.squads[1]
        );
    }

    static exampleTerrainGrid () {
        const xs = 30;
        const ys = 20;

        let grid = [];
        for (let x = 0; x < xs; x++) {
            grid.push([]);

            for (let y = 0; y < ys; y++) {
                grid[x].push(Terrain.exampleTerrain());
            }
        }

        return grid;
    }


};



GameState.testShooting();

