'use strict';

const fs = require('fs');
const Yaml = require('js-yaml');

const ARSENAL = Yaml.safeLoad(fs.readFileSync('./arsenal.yml', 'utf8'));
const Shot = require('./shot.js');
const Util = require('./util.js');


// Waffle Node
// WAFFLE is a game engine related to the novel 'You' by Austen Grossman.
// A person, creature, component, or thing is represented here
// by a WNode or a tree of WNodes.

let WNode = module.exports = class WNode {
    constructor(template, name) {
        // Later: Safety checks, logging

        if (name) {
            this.name = name;
        }

        this.status = WNode.Status.FINE;

        this.components = [];

        if (typeof template === 'object') {
            this.applyTemplates(template);
        }
    }

    applyTemplates(firstTemplate) {
        const templates = WNode.collectTemplates(firstTemplate);

        // Apply the templates backwards (starting with eg human)
        // so that the more specific ones have the opportunity to overwrite the more generic ones.
        // Later make sure this doesnt cause modification objects to be overwritten.
        for (let ti = templates.length - 1; ti >= 0; ti--) {
            const currentTemplate = templates[ti];

            // Later make sure we're handling 'multiple' nodes properly in templates.
            const NONTRANSFERRED_PROPS = [
                'components',
                'template'
            ];

            // Adopt each property of the template.
            for (let prop in currentTemplate) {
                if (Util.contains(NONTRANSFERRED_PROPS, prop)) {
                    continue;
                }

                this[prop] = currentTemplate[prop];
            }

            this.components = this.components.concat(nodesFromTerseArray(currentTemplate.components));
        }

        // Remove the 'template' prop itself from the WNode.
        delete this.template;
    }

    static collectTemplates (template) {
        const uuid = Math.round(Math.random() * 1000);

        let templates = [template];
        if (template.template) {
            const parentTemplate = findTemplate(template.template);
            const ancestorTemplates = WNode.collectTemplates(parentTemplate);
            templates = templates.concat(ancestorTemplates);
        }

        return templates;
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

    effectiveSize (terrain) {
        // Ex: A human has size 10. Sparse forest has a cover value of 0.1 (scale from 0 to 1).
        // The terrainModifier will be 0.9. The humans effective size will be 9.

        const size = this.size || 0;
        const terrainModifier = terrain && terrain.cover ?
            1 - terrain.cover :
            1;

        return size * terrainModifier;
    }

    // recalculateTraits () {}

    shoot () {
        // Later we will address multiple ways to shoot
        // and deciding between those.
        return WNode.exampleShots() || [];
    }

    toString () {
        return JSON.stringify(this, undefined, '    ');
    }

    // Format that looks like informal YAML but with props above components.
    toPrettyString (indent) {
        indent = Util.default(indent, 0);

        let outString = furtherLine(Util.formatProp(this, 'name'));
        outString += furtherLine(Util.formatProp(this, 'templateName'));

        const SPECIAL_PROPS = [
            'name',
            'templateName',
            'components'
        ];

        for (let prop in this) {
            if (! prop || Util.contains(SPECIAL_PROPS, prop)) {
                continue;
            }

            outString += furtherLine(Util.formatProp(this, prop));
        }

        if (this.components.length === 0) {
            outString += furtherLine('components: []');
        }
        else {
            outString += furtherLine('components:');
            for (let component of this.components) {
                outString += component.toPrettyString(indent + 2);
                outString += '\n';
            }

            // outString += furtherLine(']');
        }

        return outString;

        function furtherLine (text/*, indent*/) {
            return text ?
                Util.repeat(' ', indent) + text + '\n' :
                '';
        }
    }

    toYaml () {
        return Yaml.dump(this);
    }
};

// TODO put these above the class
// ie: let WNode = module.exports
// then constant static fields
// then the class

// Constants
WNode.Status = {
    FINE: 'fine',
    JUNKED: 'junked'
};

WNode.MAX_DURABILITY = 9999999999;

WNode.exampleShots = function () {
    return [
        new Shot('bullet', 0.80, 20),
        new Shot('bullet', 0.80, 20)
    ];
}


function testJsonReading() {
    const nodeTree = WNode.exampleNodesFromTerseJson();
    const stringified = nodeTree.toPrettyString();
    console.log('\ntestJsonReading() sees: \n\n' + stringified);
}


// Later: Reorder functions more intuitively
WNode.exampleNodesFromTerseJson = function () {
    // This is a little hardcoded and example-y
    const jso = exampleJsonFromTerseFile();
    const squadName = 'Requiem Veteran Infantry';
    const rootJso = jso[squadName];
    const rootNode = new WNode(ARSENAL.general.squad, squadName);
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
        Util.logError({
            context: 'nodesFromTerseJsonIterator()',
            error: 'could not read node',
            jsoNode: jso
        });
    }
}

function findTemplate(templateUri) {
    // Later: Devise and implement simple search syntax
    // Later: We are currently conflating templates of multiple nodes (eg marine)
    // and templates of 1 node (eg human).
    const template = ARSENAL.general[templateUri] ||
        ARSENAL.halo.unsc[templateUri] ||
        ARSENAL.halo.covenant[templateUri] ||
        ARSENAL.halo.forerunner[templateUri];

    if (!template) {
        Util.logError({
            error: 'Template not found in findTemplate()',
            templateUri: templateUri
        });
        return ARSENAL.general.human;
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
            chassis: ARSENAL.general.human,
            components: [
                {
                    chassis: ARSENAL.halo.unsc.battleRifle,
                    components: [
                        ARSENAL.halo.unsc.morphSight,
                        ARSENAL.halo.unsc.kineticBolts
                    ]
                },
                ARSENAL.halo.unsc.dogTags,
                ARSENAL.halo.unsc.flakArmor,
                ARSENAL.halo.forerunner.pulseGrenade
            ]
        };
    }
}



// run test
// testJsonReading();
