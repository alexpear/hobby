#!/usr/bin/python

import time
import random

yangchar = unichr(0x2588)

width = 281
height = 80

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

directions = [[1,1],
              [1,0],
              [1,-1],
              [0,1],
              [0,0],
              [0,-1],
              [-1,1],
              [-1,0],
              [-1,-1]]

#scorecharttemplate = [[0, 0, 0],
#                      [0, -1, 0],
#                      [0, 0, 0]]

def coordplus(a, b):
  newcoord = [a[0] + b[0], a[1] + b[1]]
  return newcoord

# returns whether the input is a coord representing a 0 space
def valid(coord, grid):
  if len(coord) != 2:
    return False
  if not (coord[0] >= 0 and coord[0] < len(grid) and
          coord[1] >= 0 and coord[1] < len(grid[0])):
    return False
  return (grid[coord[0]][coord[1]] == 0)

def scoreof(grid, candidatecoord, zerocoord):
  # count how many empty neighbors we would have
  score = 0
  for neighbordir in directions:
    neighborr = candidatecoord[0] + neighbordir[0]
    neighborc = candidatecoord[1] + neighbordir[1]
    if not (neighborr >= 0 and neighborr < len(grid) and
            neighborc >= 0 and neighborc < len(grid[0])):
      continue
    # treat zerocoord as zero
    if (grid[neighborr][neighborc] == 1 and
        not (neighborr == zerocoord[0] and neighborc == zerocoord[1])):
      score += 1
  return score

sanityrate = 0.9

def moveone(grid):
  r = 0
  c = 0
  while (grid[r][c] != 1):
    r = random.randrange(len(grid))
    c = random.randrange(len(grid[0]))

  # if insane, move to random empty neighbor. else move to maximize neighbors
  if random.random() > sanityrate:
    curmove = []
    while not valid(curmove, grid):
      curmove = coordplus([r,c], random.choice(directions))
    grid[r][c] = 0
    grid[curmove[0]][curmove[1]] = 1
    return

  bestscore = 0
  bestdirs = []
  for dircoord in directions:
    mover = r + dircoord[0]
    movec = c + dircoord[1]
    if not (mover >= 0 and mover < len(grid) and
            movec >= 0 and movec < len(grid[0])):
      continue
    if grid[mover][movec] != 0:
      continue
#    scorechart = [[0 for c in range(3)] for r in range(3)]
#    scorechart[1 + dircoord[0]][1 + dircoord[1]] = curscore
    curscore = scoreof(grid, [mover, movec], [r, c])

    if curscore > bestscore:
      bestdirs = [[mover, movec]]
      bestscore = curscore
    elif curscore == bestscore:
      bestdirs.append([mover, movec])

  # check if there are mulitple in bestdirs list
  if len(bestdirs) > 1:
    newcoord = random.choice(bestdirs)
  elif len(bestdirs) == 1:
    newcoord = bestdirs[0]
  else:
    newcoord = [r,c]  # no movement

  grid[r][c] = 0
  grid[newcoord[0]][newcoord[1]] = 1

  return grid


grid = randgrid()
while(True):
  for i in range(1000):
    grid = moveone(grid)
  printgrid(grid)
  time.sleep(0.1)





