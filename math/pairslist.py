#!/usr/bin/python
import random

# Cool logic puzzle and solution
# the 'odd int out' in list of pairs problem
# You are given an unordered list of ints (positive i think)
# Most values appear in the list exactly twice
# However one value appears only once in the list. 
# Find that value. 
# Solved below. 

def randlist(pairscount):
  # start with just the unique
  list = [random.randrange(1, 1001)] # 1 to 100
  for i in range(pairscount):
  	pairval = random.randrange(1, 1001)
  	list.append(pairval)
  	list.append(pairval)
  random.shuffle(list)
  return list
 
# doesn't work
def addsearch(list):
  pile = 0
  for val in list:
    if pile >= val:
      pile -= val
    else:
      pile += val
  return pile

def xor(a,b):
  return a ^ b

def xorsum(list):
  return reduce(xor, list, 0)

def test(pairscount = 3):
  list = randlist(pairscount)
  print(list)
  uniqueval = xorsum(list)
  print('xorsum(list) is ' + str(uniqueval))
  print('list.count(uniqueval) is ' + str(list.count(uniqueval)))
  print('')

test()
