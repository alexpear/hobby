'use strict';

module.exports = class Util {
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
};
