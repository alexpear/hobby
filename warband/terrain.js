'use strict';

// - Later figure out the rules for soft cover (occludes but does not block shots).
// - For now just consider it weaker hard cover

module.exports = class Terrain {
    constructor () {

    }


};

Terrain.exampleTerrain = function () {
    return {
        name: 'Sparse forest',
        cover: 0.1
    };
};
