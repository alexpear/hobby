#!/usr/bin/python

import time
import random

rule30 = {
  (0,0,0) : 0,
  (0,0,1) : 1,
  (1,0,0) : 1,
  (0,1,0) : 1,
  (1,0,1) : 0,
  (0,1,1) : 1,
  (1,1,0) : 0,
  (1,1,1) : 0
}

rule30variation = {
  (0,0,0) : 0,
  (0,0,1) : 1,
  (1,0,0) : 1,
  (0,1,0) : 0,
  (1,0,1) : 0,
  (0,1,1) : 1,
  (1,1,0) : 0,
  (1,1,1) : 0
}

rule73 = {
  (0,0,0) : 1,
  (0,0,1) : 0,
  (1,0,0) : 0,
  (0,1,0) : 0,
  (1,0,1) : 0,
  (0,1,1) : 1,
  (1,1,0) : 1,
  (1,1,1) : 0
}

rule73variation = {
  (0,0,0) : 1,
  (0,0,1) : 0,
  (1,0,0) : 0,
  (0,1,0) : 0,
  (1,0,1) : 0,
  (0,1,1) : 1,
  (1,1,0) : 0,
  (1,1,1) : 0
}

yangchar = unichr(0x2588)

width = 181 / 2

def printrow(row):
  outstring = ''
  for number in row:
    if number == 0:
      outstring += '  '
    else:
      outstring += yangchar + yangchar
  print outstring

def childof(left, mid, right):
  return rule30variation[(left, mid, right)]

def step(oldrow):
  newrow = [0 for i in range(len(oldrow))]
  for newindex in range(len(newrow)):
    if newindex == 0:
      newrow[newindex] = childof(oldrow[-1], oldrow[0], oldrow[1])
    elif newindex < (len(newrow) - 1):
      newrow[newindex] = childof(
          oldrow[newindex - 1], oldrow[newindex], oldrow[newindex + 1])
    else:
      newrow[newindex] = childof(oldrow[-2], oldrow[-1], oldrow[0])
  return newrow

row = [random.choice([0,1]) for i in range(width)]
#row[width / 2] = 1

while(True):
  printrow(row)
  time.sleep(1)
  row = step(row)






'''
printrow(row)
row2 = step(row)
printrow(row2)
'''



