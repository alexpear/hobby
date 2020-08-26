'use strict';

const Util = require('../util.js');


// In the Terra Ignota novels, the Humanistas hive legislature is controlled by representatives who each have voting power proprotional to the number of votes they received from the populace in the last election.

class Humanistas {
    constructor () {
        // type number[]
        this.representatives = [];

        while (this.totalVotes() < Humanistas.POPULATION) {
            this.addRep();
        }

        this.finalize();
    }

    totalVotes () {
        return Util.sum(this.representatives);
    }

    addRep () {
        const max = Humanistas.mostVotesTheyCouldGet();
        const votes = Math.ceil(Math.random() * max);

        this.representatives.push(votes);
    }

    finalize () {
        this.representatives.sort(
            (a, b) => a - b
        );
        this.representatives.reverse();

        let sum = 0;
        for (let i = 0; i < this.representatives.length; i++) {
            sum += this.representatives[i];

            if (sum >= Humanistas.POPULATION) {
                // Exclude any less-popular representatives from the parliament.
                this.representatives = this.representatives.slice(0, i + 1);
                break;
            }
        }
    }

    summary () {
        const lines = this.representatives.map(
            rep => {
                const name = 'Nameless Representative';
                const votes = Util.abbrvNumber(rep);
                const percent = rep / this.totalVotes() * 100;
                const nicePercent = percent.toFixed(2);

                return `${name}, with ${votes} votes (${nicePercent}%)`;
            }
        );

        const bodyText = lines.join('\n');

        return `The current Humanist Parliament consists of ${this.representatives.length} representatives:\n${bodyText}`;        
    }

    debugSummary () {
        for (let i = 0; i < this.representatives.length; i++) {
            console.log(this.representatives[i]);
        }

        Util.logDebug(`End of debugSummary() call.`)
    }

    static mostVotesTheyCouldGet () {
        const maxExponent = Math.log10(Humanistas.POPULATION);
        const minExponent = 3;

        const exponent = Math.random() * (maxExponent - minExponent) + minExponent;

        return Math.ceil(Math.pow(10, exponent));
    }

    static testMostVotesTheyCouldGet () {
        for (let n = 0; n < 100; n++) {
            Util.logDebug(Util.abbrvNumber(
                Humanistas.mostVotesTheyCouldGet()
            ));
        }
    }

    static test () {
        const gov = new Humanistas();

        Util.log(gov.summary());
    }
}

Humanistas.POPULATION = 1e9;

module.exports = Humanistas;

Humanistas.test();
