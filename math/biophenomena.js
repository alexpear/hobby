'use strict';

// Extraterrestrial Biophenomena
// Similar to the Drake Equation

// All values are made up (ie not yet researched) unless otherwise noted
var INTERACTABLE_GALAXIES = 1e10;
var SYSTEMS_PER_GALAXY = 1e15;
var EXTRA_SYSTEMS_PER_GALAXY = 1e8;
var MIN_CRECHES_PER_SYSTEM = 0;

var axes = [
    {
        name: 'stealth',
        points: [
            {
                name: 'unknown stealth',
                weight: 12
            },
            {
                name: 'no stealth',
                weight: 12
            }
            {
                name: '10LY stealth',
                weight: 12
            }
        ]
    },
    {
        name: 'cooperation',
        points: [
            {
                name: 'unknown cooperation',
                weight: 12
            },
            {
                name: 'no cooperation',
                weight: 12
            },
            {
                name: 'treaties',
                weight: 12
            },
            {
                name: 'galactic internet',
                weight: 12
            }
        ]
    },
    {
        name: 'ftl',
        points: [
            {
                name: 'unknown ftl',
                weight: 12
            },
            {
                name: 'no ftl',
                weight: 12
            }
        ]
    },
    {
        name: 'violence',
        points: [
            {
                name: 'unknown violence',
                weight: 12
            },
            {
                name: 'defense always wins',
                weight: 12
            }
        ]
    },
];

insertProbabilities(axes);
var intersectionsMatrix = intersectionsOfAxes(axes);




// Side effect: Adds fields to data structure
function insertProbabilities (axes) {
    for (axis in axes) {
        var totalWeight = axis.points.reduce(
            function (incompleteSum, curPoint) {
                return incompleteSum + curPoint.weight;
            },
            0
        );

        for (point in axis.points) {
            point.probability = point.weight / totalWeight;
        }
    }
}

// Cartesian product
function intersectionsOfAxes (axes) {
    var matrix = [
        {
            probability: 1
        }
    ]
    return getSubmatrix([], axes, 0);
    // for (axis in axes) {
    //     // No, pass a submatrix in, increasingly zoomed in
    //     // ... Well, but want to make this change to the /whole/ matrix
    //     addAxis(axis, matrix);
    // }

    // return matrix;

    function addAxis (axis, matrix) {
        // Given a tiny submatrix, expand it out ... right?
        // ... It would be easier to recurse, adding each of the axes to one region, then step back a bit and finish the neighboring region, etc.
        for (intersection in matrix) {


        }
    }

    function expandSubmatrix (submatrix, axes, axisIndex) {

        expandSubmatrix(smallerMatrix, axes, axisIndex + 1);
    }

    // Transforms 1 intersetion into an array of intersections
    // by adding a new axis to it.
    function getSubmatrix (oldIntersection, axes, axisIndex) {
        var newPoints = axes[axisIndex].points;
        var newMatrix = newPoints.map(function (point) {
            return {
                points: oldIntersection.points.concat(points),
                // probability: oldIntersection.probability * point.probability
            };
        });

        getSubmatrix(smallerMatrix, axes, axisIndex + 1);

        return submatrix;
    }
}

/*
Base case
[] -> [point point point]
or -> [[point] [point] [point]]
eh



*/


function giveIntersectionsProbabilities (submatrix) {
    

    function giveProbability (intersection) {
        intersection.probability = intersection.points.reduce(
            function (incompleteProduct, point) {
                return incompleteProduct * point.probability;
            },
            1
        );
    }
}





var exampleIntersectionMatrix = [
    [
        {
            axisVals: [
                {
                    name: 'defense always wins',
                    weight: 12,
                    probability: 0.5
                },
                {
                    name: 'no ftl',
                    weight: 12,
                    probability: 0.5
                }
            ],
            probability: 0.25
        },
        {
            axisVals: [
                {
                    name: 'defense always wins',
                    weight: 12,
                    probability: 0.5
                },
                {
                    name: 'unknown ftl',
                    weight: 12,
                    probability: 0.5
                }
            ],
            probability: 0.25
        }
    ],
    [
        {
            axisVals: [
                {
                    name: 'unknown violence',
                    weight: 12,
                    probability: 0.5
                },
                {
                    name: 'no ftl',
                    weight: 12,
                    probability: 0.5
                }
            ],
            probability: 0.25
        },
        {
            axisVals: [
                {
                    name: 'unknown violence',
                    weight: 12,
                    probability: 0.5
                },
                {
                    name: 'unknown ftl',
                    weight: 12,
                    probability: 0.5
                }
            ],
            probability: 0.25
        }
    ]
];






// Functionality wishlist
// intersectionsOfAxes() for subsets of axes
// Perhaps all sets of 2 axes, all sets of 3 axes, etc, for an input n


/* notes
Could i have a class to describe a probability distribution?
mean
variance
min max
min mean max?

Alternately, i guess i dont have to generate a data structure about intersections.
I could just calc those values at print time. Lazy loading. 
I could have a getter that gives the prob of a given intersection.
Takes n points from n axes.
And i could have an iterator that calls that getter a bunch of times. 

*/
