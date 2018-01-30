'use strict';

// Wafflechassis Warband
// browserbased deckbuilding wargame
// rough draft
// deckbuilding and limited control inspired by Beastmaster from The Seventh Tower novels
// similar to Gratuitous Space Battles
// Waffle-style point-based vehicle and soldier construction. Graphs of nodes. Chassis based.

/*
Sketch of WCW combat rules
Battles are noninteractive
However, it should be possible to make later variants in which
some of the automated decisions are made by a human player instead.
- The atomic playing piece is the Squad. Each faction has n Squads.
- At the start of each round, all squads on both sides are not yet activated.
- Each faction has a ArmyCommander. For now it is a bot but it could be a player in future.
- Alternating turns.
- On its turn, a ArmyCommander chooses one of its Squads that is not yet activated
and activates it.
- Later, give a ArmyCommander the ability to pass if another faction has more
unactivated Squads than it does.
- When a Squad is activated then chooseAction(squad) is called
  - This is a separate bot from the ArmyCommander.
  - A variant might replace the ArmyCommander with a human but retain the squad bots.
  - Or vice versa.
  - Later the Squad's morale and temperament can affect its decisions.
  - For the MRB versions, the decisions are based on simple heuristics
    - eg move to a preset optimal range from enemy Squads
    - and attack the closest target that seems likely to take substantial damage.
- The squad's action is performed and saved in the Replay along with its stochastic result.
- Once the last squad has activated, the round is over and all squads are set to unactivated again.
*/

class Replay {
    constructor() {
        // TODO These are dummy initializations. Generate and/or parameterize.
        this.armies = []; // ArmyTemplate instances
        this.terrainGrid = [[]]; // Terrain instances
        this.steps = []; // Step instances
        // NOTE: I have not yet decided whether deployment is random or what.
        // MRB: Defenders have fortifications, attackers positioned as if they just arrived.
    }

    // Later add a event history. Any node can declare a event has happened and tag it.
    // This gets saved in a array in the Replay and can be accessed centrally.
    // This permits 'Whenever a human dies, vampires get a bonus' effects.
}







