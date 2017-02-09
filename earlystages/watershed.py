#!/usr/bin/python

# watershed.py
# https://code.google.com/codejam/contest/90101/dashboard#s=p1

# Takes grid of altitude ints, outputs grid of watershed allegiances.
# Might be the same grid if necessary.
def watershed (altitudes):
    dirs = blankGrid(len(altitudes), len(altitudes[0]))
    for r, row in enumerate(altitudes):
        for c, cell in enumerate(row):
            # Get the dir of min(neighbors(r,c))
            # Write its char to dirs array

    # Then convert the NEWS grid into an ABC watersheds grid
    pass
