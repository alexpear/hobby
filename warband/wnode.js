'use strict';



/*
properties
.name
.type
.chassis or .template maybe
.size
.durability
.components
*/


class WNode {
    constructor(template, name) {
        this.name = name || 'Unknown';

        // Later: Safety checks, logging
        if (template) {
            Object.assign(this, template);
        }
    }

    static jsonToWNodes(json) {
        // Later: Convert top-levels and each element in each components array to a WNode.
    }
}

function exampleJsonFromTerseFile() {
    return {
        'Requiem Veteran Infantry': {
            components: {
                type: multiple,
                quantity: 5,
                copySet: [
                    {
                        template: 'marine',  // Later: Namespace as 'halo/unsc/marine' or something
                        components: [
                            {
                                template: 'battleRifle',
                                components: [
                                    'morphSight',
                                    'kineticBolts'
                                ]
                            },
                            'pulseGrenade'
                        ]
                        // TODO finish this func
                    }
                ]
            }
        }
    }
}

// Later this object might be defined by and read in from a Arsenal file.
const NODES = {
    general: {
        human: {
            name: 'Human',
            size: 10,
            durability: 10,
            speed: 10,
            decisions: true
        }
    },
    halo: {
        unsc: {
            // Squads

            // Individuals

            // Items
            battleRifle: {
                // later during parsing, maybe 'name' can be implied as a simple camel case to caps conversion.
                name: 'Battle Rifle',
                size: 2,
                durability: 20,
                type: 'gun',
                shots: 1,
                accuracy: 0.5,
                damage: 10,
                effectType: 'bullet'
            },
            kineticBolts: {
                name: 'Kinetic Bolts',
                size: 0,
                durability: 20,
                modification: {
                    damage: 3,
                    effectType: 'hardlight'
                }
            },
            morphSight: {
                name: 'Morph Sight',
                size: 0,
                durability: 20,
                modification: {
                    accuracy: 0.1
                }
            },
            dogTags: {
                name: 'Dog Tags',
                size: 0,
                durability: 20,
                modification: {
                    cqc: 5
                }
            },
            flakArmor: {
                name: 'Flak Armor',
                size: 5,
                durability: 15,
                modification: {
                    durability: 10
                }
            },
            fragGrenade: {
                name: 'Frag Grenade',
                size: 0,
                durability: 10,
                type: 'grenade',
                damage: 20,
                blast: 10,
                effectType: 'explosive'
            }
        }
    }
}

// Note: this intermediate might not actually appear in the real flow
function exampleJsonExpandedWithoutStats() {
    let json = {
        'Requiem Veteran Infantry': {
            components: []
        }
    };

    for (let i = 0; i < 5; i++) {
        json['Requiem Veteran Infantry'].components.push(makeExampleMarine());
    }

    return json;

    function makeExampleMarine() {
        return {
            chassis: NODES.general.human,
            components: [
                {
                    chassis: NODES.halo.unsc.battleRifle,
                    components: [
                        NODES.halo.unsc.morphSight,
                        NODES.halo.unsc.kineticBolts
                    ]
                },
                NODES.halo.unsc.dogTags,
                NODES.halo.unsc.flakArmor,
                NODES.halo.unsc.fragGrenade
            ]
        }
    }
}
