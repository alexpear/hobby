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
// Later: Standardize CONSTANTS_STYLE vs camelCaseStyle
const NODES = {
    GENERAL: {
        HUMAN: {
            name: 'human',
            size: 10,
            durability: 10,
            speed: 10,
            decisions: true
        }
    },
    HALO: {
        UNSC: {
            // Squads

            // Individuals

            // Items
            BATTLE_RIFLE: {
                name: 'Battle Rifle',
                size: 2,
                durability: 20,
                type: 'gun',
                shots: 1,
                accuracy: 0.5,
                damage: 10,
                effectType: 'bullet'
            },
            KINETIC_BOLTS: {
                name: 'Kinetic Bolts',
                size: 0,
                durability: 20,
                modification: {
                    damage: 3,
                    effectType: 'hardlight'
                }
            },
            MORPH_SIGHT: {
                name: 'Morph Sight',
                size: 0,
                durability: 20,
                modification: {
                    accuracy: 0.1
                }
            },
            DOG_TAGS: {
                name: 'Dog Tags',
                size: 0,
                durability: 20,
                modification: {
                    cqc: 5
                }
            },
            FLAK_ARMOR: {
                name: 'Flak Armor',
                size: 5,
                durability: 15,
                modification: {
                    durability: 10
                }
            },
            FRAG_GRENADE: {
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
            chassis: NODES.GENERAL.HUMAN,
            components: [
                {
                    chassis: NODES.HALO.UNSC.BATTLE_RIFLE,
                    components: [
                        NODES.HALO.UNSC.MORPH_SIGHT,
                        NODES.HALO.UNSC.KINETIC_BOLTS
                    ]
                },
                NODES.HALO.UNSC.DOG_TAGS,
                NODES.HALO.UNSC.FLAK_ARMOR,
                NODES.HALO.UNSC.FRAG_GRENADE
            ]
        }
    }
}
