'use strict';

// Rational is like the number primitive, but designed to avoid floating point errors.
// Can only represent rational numbers.

class Rational {
    constructor (number) {
        this.numerator = number;
        this.denomenator = 1;
    }

    toPrimitive () {
        return this.numerator / this.denomenator; 
    }

    // TODO: mutators
}


