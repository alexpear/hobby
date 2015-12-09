'use strict'

// dynamic programming for efficient combinations of denominations of money

var usd_basecases = function() {
  return {
    1: ['.01'],
    5: ['.05'],
    10: ['.10'],
    25: ['.25'],
    50: ['.50'],
    100: ['1'],
    200: ['2'],
    500: ['5'],
    1000: ['10'],
    2000: ['20'],
    5000: ['50'],
    10000: ['100']
  };
};

var wizarding_britain_basecases = function() {
  return {
    1: ['K'],
    29: ['S'],
    493: ['G']
  };
};

var solutions_to_string = function(dict) {
  // Use an idiom to find the highest valued key in the dict.
  var maxkey = Math.max.apply(this, Object.keys(dict).map(Number))
  var outstring = '';

  for (var i = 1; i <= maxkey; i++) {
    if (dict[i]) {
      outstring += i + ': ' + dict[i].join(' ') + '\n';
    }
  }

  return outstring;
};

// Usage: denomcombo(99) == 'HQDDPPPP'
// solutions is an optional parameter
var denomcombo = function(targetval, solutions) {
  if (! solutions) {
    solutions = usd_basecases();
  }

  if (solutions[targetval]) {
    return solutions[targetval];
  }

  // TODO: find neater, non-imperative version
  // Ideally without reducing runspeed.
  for (var subval = 1; subval < targetval; subval++) {
    if (! solutions[subval]) {
      // Recurse to populate the subval entry.
      // This will only recurse once, since we just checked all the lower entries.
      denomcombo(subval, solutions);
    }

    var counterpartval = targetval - subval;

    // If we do not yet have data on both combos, wait till later in the pass.
    if (!solutions[subval] || !solutions[counterpartval]) { continue; }

    // Now try each combination.
    var candidate_combo = solutions[counterpartval].concat(solutions[subval]);
    if (! solutions[targetval] ||
          solutions[targetval].length > candidate_combo.length) {
      solutions[targetval] = candidate_combo;
    }
  }

  return solutions[targetval];
};

var solutions = usd_basecases();
console.log(denomcombo(8010, solutions));
console.log(solutions_to_string(solutions));
