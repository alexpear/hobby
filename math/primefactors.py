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
        return [candidatefactor, primefactors(n / candidatefactor)]
    candidatefactor += 1

i = 9
while True:
  time.sleep(12)
  print ("%3d " % i) + str(flatten(primefactors(i)))
  i += 10

