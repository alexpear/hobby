'use strict';

var Util = module.exports;

Util.colors = {
    black: '1;37;40m',
    red: '1;37;41m',
    green: '1;30;42m',
    yellow: '1;37;43m',
    blue: '1;37;44m',
    purple: '1;37;45m',
    cyan: '1;30;46m',
    grey: '1;30;47m'
};

Util.default = function (input, defaultValue) {
    if (input === undefined) {
        return defaultValue;
    } else {
        return input;
    }
};

Util.inRange = function (value, min, max) {
    return min <= value && value < max;
};

Util.randomIntBetween = function (minInclusive, maxExclusive) {
    if (!minInclusive || !maxExclusive) {
        console.log('error: Util.randomIntBetween() called with missing parameters.');
        return -1;
    } else if (maxExclusive <= minInclusive) {
        console.log('error: Util.randomIntBetween() called with max <= min.');
        return -1;
    }

    return Math.floor( Math.random() * (maxExclusive - minInclusive) + minInclusive );
};

Util.randomUpTo = function (maxInclusive) {
    return Util.randomIntBetween(0, maxInclusive - 1);
};

Util.randomOf = function (array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
};
