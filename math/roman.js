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

    static allUpTo(max) {
        max = max === undefined ? 3999 : max;
        let array = [];
        for (let index = 0; index <= max; index++) {
            array.push(Roman.fromDecimal(index));
        }

        return array;
    }

    static byHeterogeneity() {
        let numeralsByHeterogeneity = {};
        for (let index = 0; index <= 3999; index++) {
            const numeral = Roman.fromDecimal(index);
            const prettyNumeral = `${ index } ~ ${ numeral }`;
            const heterogeneity = Roman.heterogeneity(numeral);
            if (numeralsByHeterogeneity[heterogeneity]) {
                numeralsByHeterogeneity[heterogeneity].push(prettyNumeral);
            }
            else {
                numeralsByHeterogeneity[heterogeneity] = [prettyNumeral];
            }
        }

        return numeralsByHeterogeneity;
    }

    // XXXI has 2 symbols and thus a heterogeneity of 2
    static heterogeneity(str) {
        let symbols = {};
        str.split('').forEach(symbol => {
            symbols[symbol] = true;
        });

        return Object.keys(symbols).length;
    }

    static basicTest() {
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

    static numeralsFor1999() {
        return [
            'MCMXCIX',
            'MDMID',
            'MCMIC',
            'MLMXLIX',
            'MLMIL',
            'MXMIX',
            'MVMIV',
            'MIM',
        ];
    }

    static allNumerals(maxLength) {
        let allRaw = Roman.allNumeralsRaw(maxLength);
        let allByValue = {};

        for (let numeral of allRaw) {
            const value = Roman.toDecimal(numeral);

            if (allByValue[value] === undefined) {
                allByValue[value] = [numeral];
            }
            // Censor non-shortest numerals
            else if (allByValue[value][0].length >= numeral.length) {
                allByValue[value].push(numeral);
            }
        }

        return allByValue;
    }

    static allNumeralsRaw(maxLength) {
        let all = Roman.extensionsOf('');
        let previousBatch = all;

        for (let i = 2; i <= maxLength; i++) {
            // TODO: Could speedup by checking each new numeral here
            // against the memoized obj allByValue.
            const newNumerals = previousBatch.reduce(
                (soFar, prevNumeral) => soFar.concat(
                    Roman.extensionsOf(prevNumeral)
                ),
                []
            );

            all = all.concat(newNumerals);
            previousBatch = newNumerals;
        }

        return all;
    }

    static extensionsOf(numeral) {
        return Roman.ALPHABET
            .map(symbol => numeral + symbol)
            // Censor the 'dumb' conflicted ones.
            .filter(numeral => ! Roman.hasInternalConflict(numeral));
    }

    // A numeral has internal conflict if it contains both a additive instance and a subtractive instance of the same symbol.
    static hasInternalConflict(numeral) {
        let additives = {};
        let subtractives = {};
        for (let i = 0; i < numeral.length; i++) {
            const curSymbol = numeral[i];
            const curValue = Roman.Values[curSymbol];
            const nextValue = (i === numeral.length - 1) ?
                0 :
                Roman.Values[numeral[i + 1]];
            if (curValue >= nextValue) {
                // Found a additive instance of this symbol.
                if (subtractives[curSymbol]) {
                    return true;
                }

                additives[curSymbol] = true;
            }
            else {
                // Found a subtractive instance of this symbol.
                if (additives[curSymbol]) {
                    return true;
                }

                subtractives[curSymbol] = true;
            }
        }

        return false;
    }

    static test() {
        console.log(
            JSON.stringify(
                Roman.allNumerals(6),
                undefined,
                '    '
            )
        );
    }
}

Roman.ALPHABET = [
    'I',
    'V',
    'X',
    'L',
    'C',
    'D',
    'M'
];

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

Roman.test();
