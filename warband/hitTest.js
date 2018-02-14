'use strict';

const Shot = require('./shot.js');
const Util = require('./util.js');

let HitTest = module.exports = class HitTest {
    constructor (accuracy, distance, targetSize, targetQuantity, homing) {
        const DEFAULT_DAMAGE = 10;
        this.shot = new Shot(Shot.Types.BULLET, accuracy, DEFAULT_DAMAGE, homing);
        this.distance = distance;
        this.targetArea = targetSize * targetQuantity;

        this.testsRun = 0;
        this.hits = 0;
    }

    test () {
        if (this.shot.hits(this.distance, this.targetArea)) {
            this.hits += 1;
        }

        this.testsRun += 1;
    }

    percentString () {
        if (this.testsRun === 0) {
            return ' 0%';
        }

        const percentage = Math.round(100 * this.hits / this.testsRun);
        return Util.leftPad(percentage + '%', 3);
    }
};

class HitTestBlock {
    constructor (distances, accuracies, targetSize, targetQuantity, homing) {
        this.distances = distances;
        this.accuracies = accuracies;

        this.grid = [];
        for (let d = 0; d < distances.length; d++) {
            this.grid[d] = [];
            for (let a = 0; a < accuracies.length; a++) {
                this.grid[d][a] = new HitTest(accuracies[a], distances[d], targetSize, targetQuantity, homing);
            }
        }
    }

    run (max, printEvery) {
        max = max || 1000000;
        printEvery = printEvery || 100000;

        while (this.grid[0][0].testsRun < max) {
            for (let row of this.grid) {
                for (let hitTest of row) {
                    for (let i = 0; i < printEvery; i++) {
                        hitTest.test();
                    }
                }
            }

            console.log(this.toString() + '\n');
        }
    }

    toString () {
        let output = '';
        output += `${this.grid[0][0].testsRun} tests each\n`;
        output += '  accuracy ->\n';
        output += `v dist ${ this.accuracies.join('  ') }\n`;
        for (let di = 0; di < this.grid.length; di++) {
            output += Util.leftPad(this.distances[di], 2) + '   ';

            for (let ai = 0; ai < this.grid[di].length; ai++) {
                output += `  ${ this.grid[di][ai].percentString() }`;
            }

            output += '\n';
        }

        return output;
    }

    static explorationTest () {
        let testBlock = new HitTestBlock(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
            10,
            20
        );

        const max = 1000000;
        testBlock.run(max);
    }
}

// Run test
HitTestBlock.explorationTest();
