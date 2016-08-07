'use strict';

var _ = require('underscore');

var fibbonacciCache = [];

function shortestFibbonacciSum (n, cache) {
    cache = cache || expandSeriesUpTo([1, 1, 2], n);

    // Look if n is in cache (sum of 1 element)...
    
    for (var sumLength = 1; sumLength <= n; sumLength++) {

    }

}

function expandSeriesUpTo (cache, max) {
    if (! cache || cache.length < 2) {
        cache = [0, 1, 1];
    }
}

function biggestNumberUnder (cache, n) {
    
}

/* Notes

1 1 2 3 5 8 13 21 34

30
21 8 1
21 5 3 1
21 5 2 2
21 3 3 3

*/
