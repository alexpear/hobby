'use strict';

const moment = require('moment');

module.exports = class Util {
    static exists (x) {
        return x !== undefined &&
            x !== null &&
            x !== [];
    }

    static isNumber (x) {
        return typeof x === 'number';
    }

    static isString (x) {
        return typeof x === 'string';
    }

    static stringify (x) {
        return JSON.stringify(
            x,
            undefined,
            '    '
        );
    }

    // static sum (array) {}

    static logError (input) {
        const dateTime = moment().format('YYYY MMM D hh:mm:ss.S');
        const info = Util.isString(input) ?
            input :
            Util.stringify(input);

        // Later: Red text
        console.log(`  ERROR (${ dateTime }) ${ info }\n`);
    }
};
