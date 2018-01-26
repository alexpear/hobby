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

Util.COLORS = {
    red: '\x1b[1;37;41m',
    yellow: '\x1b[1;37;43m',
    green: '\x1b[1;30;42m',
    cyan: '\x1b[1;30;46m',
    blue: '\x1b[1;37;44m',
    purple: '\x1b[1;37;45m',
    grey: '\x1b[1;30;47m',
    black: '\x1b[1;37;40m'
};

Util.colored = function (str, color) {
    const BALANCE = '\x1b[0m';
    const colorStart = Util.COLORS[color] || Util.COLORS.purple;
    return colorStart + str + BALANCE;
};

// Util.sum = function (array) {}

Util.log = function (input, tag) {
    const TAG_COLORS = {
        error: 'red',
        beacon: 'yellow'
    };

    const tagColor = TAG_COLORS[tag.toLowerCase()];
    const tagStr = tagColor ?
        Util.colored(tag.toUpperCase(), tagColor) :
        tag;

    const dateTime = moment().format('YYYY MMM D hh:mm:ss.S');

    const info = Util.isString(input) ?
        input :
        Util.stringify(input);

    // Later: Red error and beacon text
    console.log(`  ${tagStr} (${ dateTime }) ${ info }\n`);
};

Util.logError = function (input) {
    Util.log(input, 'ERROR');
};
