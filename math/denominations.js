'use strict'

// dynamic programming for efficient combinations of denominations of money

var usd_basecases = function() {
  return {
    1: '.01',
    5: '.05',
    10: '.10',
    25: '.25',
    50: '.50',
    100: '1',
    200: '2',
    500: '5',
    1000: '10',
    2000: '20',
    5000: '50',
    10000: '100'
  };
};

var solutions_to_string = function(dict) {
  // Use an idiom to find the highest valued key in the dict.
  var maxkey = Math.max.apply(this, Object.keys(dict).map(Number))
  var outstring = '';

  for (var i = 1; i <= maxkey; i++) {
    if (dict[i]) {
      outstring += i + ': ' + dict[i] + '\n';
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
  var shortest_length_so_far = 99999;
  for (var smallpart = 1; smallpart <= targetval/2; smallpart++) {
    var bigpart = targetval - smallpart;

    // Always calculate small values before big ones
    var smallcombo = denomcombo(smallpart, solutions);
    var bigcombo = denomcombo(bigpart, solutions);
    var targetcombo = bigcombo + ' ' + smallcombo;
    if (targetcombo.length < shortest_length_so_far) {
      var shortest_length_so_far = targetcombo.length;
      solutions[targetval] = targetcombo;
    }
  }

  return solutions[targetval];
};

var solutions = usd_basecases();
console.log(denomcombo(7999, solutions));
console.log(solutions_to_string(solutions));
