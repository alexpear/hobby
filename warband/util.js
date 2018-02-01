'use strict';

const moment = require('moment');

let Util = module.exports;

Util.exists = function (x) {
    return x !== undefined &&
        x !== null &&
        x !== NaN &&
        x !== '';
        // x !== [];
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
    black: '\x1b[1;37;40m',
    balance: '\x1b[0m'
};

Util.colored = function (str, color) {
    const colorStart = Util.COLORS[color] || Util.COLORS.purple;
    return colorStart + str + Util.COLORS.balance;
};

// Util.sum = function (array) {}

Util.LOG_LEVELS = {
    error: true,
    warn: true,
    beacon: true,
    event: true,
    debug: true,
    noisy: true
};

Util.log = function (input, tag) {
    // TODO: Use chalk functions instead.
    const TAG_COLORS = {
        error: 'red',
        warn: 'yellow',
        beacon: 'purple',
        event: 'blue'
        // Omitted: noisy, debug
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

Util.logDebug = function (input) {
    if (Util.LOG_LEVELS.debug) {
        Util.log(input, 'debug');
    }
};

Util.logEvent = function (input) {
    if (Util.LOG_LEVELS.event) {
        Util.log(input, 'event');
    }
};

Util.logNoisy = function (input) {
    if (Util.LOG_LEVELS.noisy) {
        Util.log(input, 'noisy');
    }
};

Util.logWarn = function (input) {
    if (Util.LOG_LEVELS.warn) {
        Util.log(input, 'warn');
    }
};

Util.logError = function (input) {
    if (Util.LOG_LEVELS.error) {
        Util.log(input, 'ERROR');
    }
};

Util.logBeacon = function (input) {
    if (Util.LOG_LEVELS.beacon) {
        Util.log(input, 'BEACON');
    }
};
