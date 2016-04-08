#!/usr/bin/python

#prime factorization

import time

def flatten(l, ltypes=(list, tuple)):
  ltype = type(l)
  l = list(l)
  i = 0
  while i < len(l):
    while isinstance(l[i], ltypes):
      if not l[i]:
        l.pop(i)
        i -= 1
        break
      else:
        l[i:i + 1] = l[i]
    i += 1
  return ltype(l)

def isprime(n):
  '''check if integer n is a prime'''
  # make sure n is a positive integer
  n = abs(int(n))
  # 0 and 1 are not primes
  if n < 2:
    return False
  # 2 is the only even prime number
  if n == 2:
    return True
  # all other even numbers are not primes
  if not n & 1:
    return False
  # range starts with 3 and only needs to go up the squareroot of n
  # for all odd numbers
  for x in range(3, int(n**0.5)+1, 2):
    if n % x == 0:
      return False
  return True

def primefactors(n):
  if isprime(n):
    return [n]
  candidatefactor = 2
  while(True):
    if isprime(candidatefactor):
      if n % candidatefactor == 0:
        return flatten([candidatefactor, primefactors(n / candidatefactor)])
    candidatefactor += 1

def arraytostring(array):
  return ' '.join(
    map(str, array)
  )

# meditate on factors of 9, 19, 29, 39...
def niners():
  i = 9
  while True:
    time.sleep(12)
    print ("%3d " % i) + str(primefactors(i))
    i += 10

# find numbers with many prime factors
def factorynumbers(max):
  factorisations = [[0], [1]]
  i = 2
  while i <= max:
    factorisations.append(primefactors(i))
    i += 1

  return factorisations

def print_factorisations(factorisations):
  for i, factorlist in enumerate(factorisations):
    print ('{i} has {fs}'.format(i=i, fs=arraytostring(factorlist)))

def variety(numbers):
  uniques = []
  for n in numbers:
    if n not in uniques:
      uniques.append(n)
  return len(uniques)

def print_manyfactors(max):
  factorisations = factorynumbers(max)
  MIN_FACTORS = 10
  longpairs = [[i, factorlist] for i, factorlist in enumerate(factorisations) if len(factorlist) >= MIN_FACTORS]
  longstrs = map(
    lambda (longpair): str(longpair[0]) + ' has ' + arraytostring(longpair[1]),
    longpairs
  )
  print ('\n'.join(longstrs))

# TODO: number of factors, prime or otherwise, of a number
# ie combos of primes too

def variousnums(max = 10080):
  factorisations = factorynumbers(max)
  MIN_VARIETY = 6
  variouspairs = [[i, factorlist] for i, factorlist in enumerate(factorisations) if variety(factorlist) >= MIN_VARIETY]
  longstrs = map(
    lambda (pair): str(pair[0]) + ' has ' + arraytostring(pair[1]),
    variouspairs
  )
  print ('\n'.join(longstrs))

variousnums(100800)
