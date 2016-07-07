




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
    // 90
};

function numberName (number) {
    // TODO: Extra-robust input hurdles.
    // Integral. Negative...
    if (isNaN(number)) {
        return 'NaN';
    }

    var name = (number < 0) ? 'negative ' : '';

    if (number in leafNames) {
        return name + leafNames[number];
    }

    // TODO: undecided whether to recurse on Number or String representations.
    // TODO performance, elegance.
    var digitCount = number.toString().length;
    if (digitCount > 3) {
        // Pluck off leftmost 1-3 digits.
        var prefixIndex = findRemainderOfThrees(digitCount);
        var leftDigits = sliceDigits(number, 0, prefixIndex);
        var rightDigits = sliceDigits(number, prefixIndex, digitCount);
        name += numberName(leftDigits) + ' '
            + tripletName(placeholder(digitCount)) + ', '
            + numberName(rightDigits);
    }
    else if (digitCount === 3) {
        var firstDigit = sliceDigits(number, 0, 1);
        var last2Digits = sliceDigits(number, 1, 3);
        name += leafNames[firstDigit] + ' hundred and '
            + numberName(last2Digits);
    }
    else if (digitCount === 2) {
        var tensDigit = sliceDigits(number, 0, 1);
        var unitDigit = sliceDigits(number, digitCount-1, digitCount);
        if (number <= 19) {
            // Note that we already passed the leafNames hurdle,
            // which includes 0-12 and irregular teens.
            name += numberName(unitDigit) + 'teen';
        }
        else {
            // 20 thru 99

            // Calculating the decade name is perverse but amusing.
            // More practically, we could encode all decade names as leaves.
            var decadeName = leafNames[tensDigit * 10] || (leafNames[tensDigit] + 'ty');
            name += (unitDigit === 0) ? decadeName : decadeName + '-' + leafNames[unitDigit];
        }
    }

    return name;
}

function placeholder () {
    return null;
}

// function nameOfSingleDigitNumber (number) {

// }
