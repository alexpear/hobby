#!/usr/bin/python

# Arrow Cellular Automata

import random

BLANK = 0
UP = 1
RIGHT = 2
DOWN = 3
LEFT = 4

class World:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.grid = self.newGrid(rows, cols)
        self.t = 0

    def newGrid (rows, cols):
        return [[BLANK for c in range(cols)] for r in range(rows)]

    def copyGrid (self):
        return [[self.grid[r][c] for c in range(cols)] for r in range(rows)]

    def step (self):
        nextGrid = self.copyGrid()
        pass

    def microStepRandom (self):
        r = random.randrange(0, self.rows)
        c = random.randrange(0, self.cols)

        pass

    def stepPerSquare (self):
        pass

    # def 

