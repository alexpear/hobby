#!/usr/bin/python

# bitmap, then iteratively makes more symmetrical, end up with partial rorschach

import time
import random

yangchar = unichr(0x2588)

width = 181
height = 41

def printgrid(grid):
  outstring = ''
  for r in grid:
    outstring += '\n'
    for val in r:
      if val == 0:
        outstring += ' '
      else:
        outstring += yangchar
  print outstring

def randgrid():
  return [[random.choice([0,1]) for c in range(width)] for r in range(height)]

def tweak(grid):
  r = random.randrange(len(grid))
  c = random.randrange(len(grid[0]))
  half = len(grid[0]) / 2
  if c < half:
    mirrorc = len(grid[0]) - 1 - c
  elif c == half:
    mirrorc = half  # assume odd number of cols for now +++
  else:
    mirrorc = (c - (len(grid[0]) - 1)) * -1

  oldval = grid[r][c]
  if oldval == 0:
    newval = 1
  else:
    newval = 0

  grid[r][c] = newval
  grid[r][mirrorc] = newval
  return grid

bitmap = randgrid()
while(True):
  bitmap = tweak(bitmap)
  printgrid(bitmap)
  time.sleep(0.1)


'''
# test
bitmap = [[0 for c in range(width)] for r in range(height)]
while(True):
  for i in range(100):
    bitmap = tweak(bitmap)
  printgrid(bitmap)
  time.sleep(0.5)
'''

