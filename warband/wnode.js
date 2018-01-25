'use strict';

const fs = require('fs');
// const Util = require('util.js');
const Yaml = require('js-yaml');

const NODES = Yaml.safeLoad(fs.readFileSync('./arsenal.yml', 'utf8'));

const MAX_DURABILITY = 9999999999;

// Later move to own file
class Util {
    static exists (x) {
        return x !== undefined &&
            x !== null &&
            x !== [];
    }

    static isNumber (x) {
        return typeof x === 'number';
    }

    static stringify (x) {
        return JSON.stringify(
            x,
            undefined,
            '    '
        );
    }

    // static sum (array) {}

    // static log (foo) {}
}

class WNode {
    constructor(template, name) {
        // Later: Safety checks, logging

        if (name) {
            this.name = name;
        }

        if (template) {
            // Adopt each property of the template.
            // Later: I would like leaf nodes to involve either pointers to templates
            // or WNodes created based on the modifications described in the templates.
            Object.assign(this, template);
            this.components = nodesFromTerseArray(template.components);
        }
        else {
            this.components = [];
        }
    }

    receiveModifications() {
        for (let component of this.components) {
            component.receiveModifications();

            const mod = component.modification;
            if (! mod) {
                continue;
            }

            for (const tweakedProp in mod) {
                if (
                    Util.exists(this[tweakedProp]) &&
                    Util.isNumber(this[tweakedProp]) &&
                    Util.isNumber(mod[tweakedProp])
                ) {
                    this[tweakedProp] += mod[tweakedProp];
                }
                else {
                    this[tweakedProp] = mod[tweakedProp];
                }
            }

            delete component.modification;
        }
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
        return Yaml.dump(this);
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
    const terseComponents = rootJso.components;
    if (terseComponents) {
        rootNode.components = nodesFromTerseArray(terseComponents);
    }

    rootNode.receiveModifications();

    return rootNode;
}

function nodesFromTerseArray(terseArray) {
    if (!terseArray || !terseArray.length) {
        return [];
    }

    return terseArray.reduce(
        (
            (componentNodes, jsoComponent) =>
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
