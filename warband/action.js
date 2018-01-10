'use strict';



class Action {
    constructor() {
        this.actor = undefined; // Actor or Squad instance.
        // NOTE: will need to save to a file without circular reference problems. 
        // JSOG, or modified JSON func, or use a ID here, etc.
        this.weaponTemplate = undefined; // Or more generic.
        this.target = undefined; // Squad instance or whatever
        this.outcome = undefined; // Outcome instance

    }


}
