'use strict';

var kaprekar = module.exports;

var leftPad = require('left-pad');

kaprekar.next = function (origString) {
	var nextInt =
		parseInt(origString.split('').sort().reverse().join('')) -
		parseInt(origString.split('').sort().join(''));
	return leftPad(nextInt, origString.length, 0);
};

function run () {
	// For when this file is run as a command line script:
	if (process.argv.length !== 3) {
		console.log('usage: node kaprekar.js <integer>');
	} else {
		var curNum = process.argv[2];
		var successors = {};
		while (! successors[curNum]) {
			console.log(curNum);
			successors[curNum] = kaprekar.next(curNum);
			curNum = successors[curNum];
		}
	}
}

// todo: make compatible with module mode
run();
