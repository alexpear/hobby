'use strict';

// Roman Numerals

const NULLUS = 'NVLLVS';

class Roman {
    static fromDecimal (decimal) {
        if (decimal < 0 || 3999 < decimal || decimal % 1 !== 0) {
            throw new Error('stick to commonplace roman symbols pls');
        }

        if (decimal === 0) {
            return NULLUS;
        }

        const decimalPlaces = decimal.toString()
            .split('')
            .map((char) => Number(char));

        // I could make a loop and a output array but i'm not going to right now because this is just a quick script.
        let thousands = '';
        if (decimalPlaces.length >= 4) {
            let relevantDigit = decimalPlaces[decimalPlaces.length - 4];
            thousands = Roman.Patterns[relevantDigit * 1000];
        }

        let hundreds = '';
        if (decimalPlaces.length >= 3) {
            let relevantDigit = decimalPlaces[decimalPlaces.length - 3];
            hundreds = Roman.Patterns[relevantDigit * 100];
        }

        let tens = '';
        if (decimalPlaces.length >= 2) {
            let relevantDigit = decimalPlaces[decimalPlaces.length - 2];
            tens = Roman.Patterns[relevantDigit * 10];
        }

        let ones = '';
        if (decimalPlaces.length >= 1) {
            let relevantDigit = decimalPlaces[decimalPlaces.length - 1];
            ones = Roman.Patterns[relevantDigit];
        }

        return thousands + hundreds + tens + ones;
    }

    static toDecimal (numeral) {
        if (numeral === NULLUS) {
            return 0;
        }

        const symbolValues = numeral.split('')
            .map((symbol) => {
                const value = Roman.Values[symbol];
                if (value === undefined) {
                    throw new Error(`roman symbol ${ symbol } not found`);
                }

                return value;
            });

        let decimal = 0;
        for (let index = 0; index < numeral.length; index++) {
            // Normal, additive case
            if (index === numeral.length - 1 || symbolValues[index] >= symbolValues[index + 1]) {
                decimal += symbolValues[index];
            }
            // Subtractive case
            else {
                decimal -= symbolValues[index];
            }
        }

        return decimal;
    }
}

Roman.Values = {
    N: 0,
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
};

Roman.Patterns = {
    0: '',
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
    20: 'XX',
    30: 'XXX',
    40: 'XL',
    50: 'L',
    60: 'LX',
    70: 'LXX',
    80: 'LXXX',
    90: 'XC',
    100: 'C',
    200: 'CC',
    300: 'CCC',
    400: 'CD',
    500: 'D',
    600: 'DC',
    700: 'DCC',
    800: 'DCCC',
    900: 'CM',
    1000: 'M',
    2000: 'MM',
    3000: 'MMM'
};


function test() {
    for (let index = 0; index <= 3999; index++) {
        const romanized = Roman.fromDecimal(index);
        const rearabicized = Roman.toDecimal(romanized);
        const difference = index - rearabicized;
        console.log(`${ index } ~ ${ romanized } ${ difference === 0 ? '' : ' ~ ' + difference }`);
        if (difference !== 0) {
            throw new Error('asymmetric');
        }
    }
}

test();
