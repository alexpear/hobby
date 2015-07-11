#!/usr/bin/python

'''
never mind the below, unicode saves! 
unichr(0x2588)

good chars to use for displaying grid
0 # @ X O = | H - 8 + 
would be nice if could use extended ascii like a solid rect but idk how to express these, deal with later 
'''

import random 
from pprint import pprint
import StringIO
import math 
import sys

def gridstr(grid):
  outstr = StringIO.StringIO()
  for i in range(len(grid)):
    outstr.write('  ')
    for j in range(len(grid[i])):
      if grid[i][j]:
        outstr.write(unichr(0x2588) + unichr(0x2588))
      else:
        outstr.write('  ')
    outstr.write('\n')
  str = outstr.getvalue()
  outstr.close()
  return str

def rorschach(rows, cols):
  grid = [ [False for i in range(cols)] for j in range(rows)]
  for i, row in enumerate(grid):
    for j, bool in enumerate(row):
      length = len(row)
      if j >= math.ceil(length/2.0):  # if beyond halfway point, stop generating 
        break
      grid[i][j] = random.choice([True, False])  
      grid[i][length-1-j] = grid[i][j]
  return grid

def rorschachsquare(side):
  return rorschach(side, side)

# prints a rorschach with rows and cols specified by 1st & 2nd arguments 
# print gridstr(rorschach(int(sys.argv[1]), int(sys.argv[2])))
