

var leafNames = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    // 14: 'fourteen',
    15: 'fifteen',
    // 16: 'sixteen',
    // 17: 'seventeen',
    18: 'eighteen',
    // 19
    20: 'twenty',
    30: 'thirty',
    40: 'forty',
    50: 'fifty',
    // 60: 'sixty',
    // 70: 'seventy',
    80: 'eighty',
    // 90: 'ninety'
};

// Test.
var trial = numberName(410782635);
var desired = 'four hundred and ten million, seven hundred and eighty-two thousand, six hundred and thirty-five';
var works = (trial === desired);
console.log(trial);
console.log(desired);
console.log(works);

// var large = 9871365235891240579760316295120398561902365012975610925601293471092356;
// console.log(large);
// console.log(numberName(large));

function numberName (number) {
    // TODO: Extra-robust input hurdles.
    // Integral.
    if (isNaN(number)) {
        return 'NaN';
    }

    if (number % 1 !== 0) {
        // TODO could render non integers properly.
        var remainder = number % 1;
        return numberName(Math.trunc(number)) + ' plus ' + remainder.toString();
    }

    // TODO replace with return 'negative ' + numberName(Math.abs(number))
    if (number < 0) {
        return 'negative ' + numberName(Math.abs(number));
    }

    if (number in leafNames) {
        return leafNames[number];
    }

    // TODO: could be less clumsy to recurse on String representations.
    // TODO performance, elegance.
    // TODO: bug with very large numbers and scientific notation.
    var digitCount = number.toString().length;
    if (digitCount > 3) {
        // Pluck off leftmost 1-3 digits.
        var prefixIndex = indexOfSecondTriplet(digitCount);
        var leftDigits = sliceDigits(number, 0, prefixIndex);
        var rightDigits = sliceDigits(number, prefixIndex, digitCount);
        return numberName(leftDigits) + ' '
            + tripletName(digitCount) + ', '
            + numberName(rightDigits);
    }
    else if (digitCount === 3) {
        var firstDigit = sliceDigits(number, 0, 1);
        var last2Digits = sliceDigits(number, 1, 3);
        return leafNames[firstDigit] + ' hundred and '
            + numberName(last2Digits);
    }
    else if (digitCount === 2) {
        var tensDigit = sliceDigits(number, 0, 1);
        var unitDigit = sliceDigits(number, digitCount-1, digitCount);
        if (number <= 19) {
            // Note that we already passed the leafNames hurdle,
            // which includes 0-12 and irregular teens.
            return numberName(unitDigit) + 'teen';
        }
        else {
            // 20 thru 99

            // Calculating the decade name is perverse but amusing.
            // More practically, we could encode all decade names as leaves.
            var decadeName = leafNames[tensDigit * 10] || (leafNames[tensDigit] + 'ty');
            return (unitDigit === 0) ? (decadeName) : (decadeName + '-' + leafNames[unitDigit]);
        }
    }

    return 'cthulhu is flaggin';
}

function indexOfSecondTriplet (digitCount) {
    var smallestTripletSize = digitCount % 3;
    return smallestTripletSize || 3;  // Correct 0 to 3.
}

function sliceDigits (number, first, lastExclusive) {
    var numberString = number.toString();
    var slicedString = numberString.slice(first, lastExclusive);
    return parseNumber(slicedString);
}

function tripletName (digitCount) {
    var tripletNames = {

    }
}

// function numberStringName (numberString) {
//
// }
