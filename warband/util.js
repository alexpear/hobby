'use strict';

const moment = require('moment');

let Util = module.exports;

Util.exists = function (x) {
    return x !== undefined &&
        x !== null &&
        x !== [];
};

Util.isNumber = function (x) {
    return typeof x === 'number';
};

Util.isString = function (x) {
    return typeof x === 'string';
};

Util.stringify = function (x) {
    return JSON.stringify(
        x,
        undefined,
        '    '
    );
};

Util.colored = function (str, color) {
    const BALANCE = '\e[0m';
    const COLORFORM = '\e[34m';
};

// Util.sum = function (array) {}

Util.log = function (input, tag) {
    const dateTime = moment().format('YYYY MMM D hh:mm:ss.S');
    const info = Util.isString(input) ?
        input :
        Util.stringify(input);

    // Later: Red error and beacon text
    console.log(`  ${tag} (${ dateTime }) ${ info }\n`);
};

Util.logError = function (input) {
    Util.log(input, 'ERROR');
};
