#!/usr/bin/python

import math

# entropy of a set
# setsummary is like: [3, 2, 1] which represents a set like { A A A B B C }
def s(setsummary):
  size = 0.0
  for count in setsummary:
    size += count

  s = 0
  for count in setsummary:
    if count > 0:
      s += count * math.log(size / count)

  return s / size

def whichone(l):
  # try decrementing each one
  for index, count in enumerate(l):
    if l[index] > 0:
      l[index] -= 1
      print(str(l) + ' has an entropy of ' + str(s(l)))
      # and revert the change
      l[index] += 1



