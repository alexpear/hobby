#!/usr/bin/python

# Rational is like the number primitive, but designed to avoid floating point errors.
# Can only represent rational numbers.

class Rational:
    def __init__(self, number):
        self.numerator = number
        self.denomenator = 1

    def toPrimitive (self):
        return self.numerator / float(self.denomenator) 

    def simplified (self):
        if self.numerator % self.denomenator == 0:
            return Rational(self.numerator / self.denomenator)
        elif self.denomenator % self.numerator == 0:
            # return Rational(1/float(self.))
            # ?
            pass
        else:
            # return copy
            pass

    def setDenominator (self, newDenom):
        pass

    def plus (self, other):
        pass

    # TODO: mutators


