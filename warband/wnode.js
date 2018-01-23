'use strict';

const json2yaml = require('json2yaml');


const MAX_DURABILITY = 9999999999;

// Later this object might be defined by and read in from a Arsenal file.
const NODES = {
    general: {
        human: {
            templateName: 'Human',
            size: 10,
            durability: 10,
            speed: 10,
            decisions: true
        },
        squad: {
            templateName: 'Squad',
            size: 0,
            durability: MAX_DURABILITY,
            type: 'abstract'
        }
    },
    halo: {
        // Later: The unsc namespace might be redundant here.
        unsc: {
            // Squads

            // Individuals
            marine: {
                templateName: 'Marine',
                template: 'human',
                components: [
                    'dogTags',
                    'flakArmor'
                    // 'pistol'
                ]
            },

            // Items
            battleRifle: {
                // later during parsing, maybe 'name' can be implied as a simple camel case to caps conversion.
                templateName: 'Battle Rifle',
                size: 2,
                durability: 20,
                type: 'gun',
                shots: 1,
                accuracy: 0.5,
                damage: 10,
                effectType: 'bullet'
            },
            kineticBolts: {
                templateName: 'Kinetic Bolts',
                size: 0,
                durability: 20,
                modification: {
                    damage: 3,
                    effectType: 'hardlight'
                }
            },
            morphSight: {
                templateName: 'Morph Sight',
                size: 0,
                durability: 20,
                modification: {
                    accuracy: 0.1
                }
            },
            dogTags: {
                templateName: 'Dog Tags',
                size: 0,
                durability: 20,
                modification: {
                    cqc: 5
                }
            },
            flakArmor: {
                templateName: 'Flak Armor',
                size: 5,
                durability: 15,
                modification: {
                    durability: 10
                }
            },
            fragGrenade: {
                templateName: 'Frag Grenade',
                size: 0,
                durability: 10,
                type: 'grenade',
                damage: 20,
                blast: 10,
                effectType: 'explosive'
            }
        },
        covenant: {

        },
        forerunner: {

            // Items
            pulseGrenade: {
                templateName: 'Pulse Grenade',
                size: 0,
                durability: 10,
                type: 'grenade',
                damage: 20,
                blast: 10,
                effectType: 'hardlight',
                special: {
                    duration: 2
                }
            }
        }
    }
};

class WNode {
    constructor(template, name) {
        // Later: Safety checks, logging

        if (name) {
            this.name = name;
        }

        if (template) {
            // Adopt each property of the template.
            Object.assign(this, template);
            // this.components = template.components.map(templateComponent => new WNode(templateComponent));
            this.components = nodesFromTerseArray(template.components);
        }
        else {
            this.components = [];
        }
    }

    static jsonToWNodes(jsoNode) {
        // Later: Convert top-levels and each element in each components array to a WNode.

        // For now, we require this func's input to represent a root node.
        // Later, this can be a parser that is more flexible about its input.

    }

    deepCopy() {
        let clone = new WNode();
        Object.assign(clone, this);

        clone.components = this.components.map(component => component.deepCopy());
        return clone;
    }

    toString() {
        return JSON.stringify(this, undefined, '    ');
    }

    toYaml() {
        return json2yaml.stringify(this);
    }
}

function testJsonReading() {
    const nodeTree = exampleNodesFromTerseJson();
    const stringified = nodeTree.toYaml();
    console.log('\n testJsonReading() sees ' + stringified);
}


// run test
testJsonReading();


// Later: Reorder functions more intuitively
function exampleNodesFromTerseJson() {
    // This is a little hardcoded and example-y
    const jso = exampleJsonFromTerseFile();
    const squadName = 'Requiem Veteran Infantry';
    const rootJso = jso[squadName];
    const rootNode = new WNode(NODES.general.squad, squadName);
    if (rootJso.components) {
        rootNode.components = nodesFromTerseArray(rootJso.components);
    }

    return rootNode;
}

function nodesFromTerseArray(terseArray) {
    if (!terseArray || !terseArray.length) {
        return [];
    }

    return terseArray.reduce(
        (
            (componentNodes, jsoComponent) =>
                // TODO There is a bug somewhere where a string is being put into concat()
                // instead of a array.
                componentNodes.concat(
                    nodesFromTerseJsonIterator(jsoComponent)
                )
        ),
        []
    );
}

// Returns a array (because type-multiple nodes require this).
function nodesFromTerseJsonIterator(jso) {
    if (jso.type === 'multiple') {
        let nodes = [];
        for (let i = 0; i < jso.quantity; i++) {
            const newNodes = nodesFromTerseArray(jso.copySet);
            nodes = nodes.concat(newNodes);
        }

        return nodes;
    }
    else if (jso.template || jso.chassis) {
        const templateInput = findTemplate(jso.template || jso.chassis);
        let localRootNode = new WNode(templateInput, jso.name);

        if (jso.components) {
            const childComponents = nodesFromTerseArray(jso.components);
            localRootNode.components = localRootNode.components.concat(childComponents);
        }

        return localRootNode;
    }
    else if (typeof jso === 'string') {
        const template = findTemplate(jso);
        return [
            new WNode(template)
        ];
    }
    else {
        // Later: Logging func
        console.log('ERROR in nodesFromTerseJsonIterator(): could not read node: ' + JSON.stringify(jso));
    }
}

function findTemplate(templateUri) {
    // Later: Devise and implement simple search syntax
    // Later: We are currently conflating templates of multiple nodes (eg marine)
    // and and templates of 1 node (eg human).
    const template = NODES.general[templateUri] ||
        NODES.halo.unsc[templateUri] ||
        NODES.halo.covenant[templateUri] ||
        NODES.halo.forerunner[templateUri];

    if (!template) {
        console.log('ERROR Template not found in findTemplate(): ' + templateUri);
        return NODES.general.human;
    }

    return template;
}

function exampleJsonFromTerseFile() {
    return {
        'Requiem Veteran Infantry': {
            components: [
                {
                    type: 'multiple',
                    quantity: 3,
                    copySet: [
                        {
                            // TODO store this in NODES somewhere.
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
                        }
                    ]
                }
            ]
        }
    };
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
                NODES.halo.forerunner.pulseGrenade
            ]
        };
    }
}
