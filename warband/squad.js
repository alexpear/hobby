'use strict';



// opts
// - class Squad extends class WNode
// - class Squad wraps a WNode which represents a squad
// - class Squad wraps a array of WNode individuals
//   - In this system all WNodes are corporeal objects
//   - Advantage of a Squad class: Can put methods like shoot() and decide() on it.
// - Squad is not a class; instead it's a WNode tree instantiated with static methods

// WNodes represent the light-simulation worldstate. Squads are game units of command.
// When the game has a simplifying abstraction, the Squad stores it and
// the details in the WNode trees are glossed over.
// Squads of one individual are common, such as a assassin or a large monster.
// Similarly, a Squad might contain 1 aircraft with 1 pilot.
// All individuals or vehicles in a Squad must always stay near each other
// in the same grid square.
// However, Squads can split up / bud into 2 Squads, for example
// when a transport vehicle drops off its passengers.

class Squad {
    
}
