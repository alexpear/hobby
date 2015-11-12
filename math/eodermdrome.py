#!/usr/bin/python

# EODERMDROME
# A series of symbols where
#   for each unique type of symbol in the series,
#     that type is adjacent to each other type exactly once, and
#   no symbol-type appears adjacent to itself.
#
# Implications:
#   For series longer than 2, the first and last symbols must be the same.
#   For series longer than 2, there must be an odd number of unique symbols.
#   The series must have one of several lengths (see below),
#     notably 4, 11, and 22.
#
# Examples:
#   ROAR
#   SAMSON MOANS
#   END CODE ONCE

def uniqueletters(string): 
  # Could maybe be sped up with hash table
  uniques = ''
  for letter in string:
  	if letter not in uniques:
  	  uniques += letter
  return uniques

def uniquetypes(string):
  return len(uniqueletters(string))

# special cases 0 and 2, and (k**2 - k) / 2 + 1 where k is a positive odd integer
small_eodermdrome_lengths = [0, 1, 2, 4, 11, 22, 37, 56, 79]

def uniques_count_to_eodermdrome_length(uniques_count):
  # vertex_circuit_length = uniques_count
  # circuits_count = uniques_count // 2
  # return vertex_circuit_length * circuits_count + 1
  return (uniques_count**2 - uniques_count) / 2.0 + 1

# Given a length, returns how many unique symbolss
# a valid eodermdrome of that length would have.
def length_to_uniques_count(length):
  length_to_uniques = {
    0: 0,
    1: 1,
    2: 2,
    4: 3,
    11: 5,
    22: 7,
    37: 9,
    56: 11,
    79: 13
  }

  # Most cases
  longest_familiar = small_eodermdrome_lengths[-1]
  if (length <= longest_familiar and
    length in length_to_uniques):
    return length_to_uniques[length]

  # uniques = length_to_uniques[79] + 1
  uniques = length_to_uniques[longest_familiar]
  MAX_UNIQUES_WORTH_CONSIDERING = 27
  while uniques < MAX_UNIQUES_WORTH_CONSIDERING:
    expectedlength = uniques_count_to_eodermdrome_length(uniques)
    if expectedlength == length:
      return uniques
    elif expectedlength > length:
      return None
    # Only consider odd numbers
    uniques += 2

  # we cant find the uniques count
  return None

def cleanup(string):
  string = string.strip().upper()
  # Remove interior whitespace
  return ''.join(char for char in string if char != ' ')

# Accepts '', 'A', 'AS', 'ASIA', etc
def is_eodermdrome(string):
  string = cleanup(string)

  # Trivial cases
  # eg '' or 'R'
  if len(string) <= 1:
    return True
  # eg 'RO'
  if len(string) == 2:
    return string[0] != string[1]
  # eg 'ROA'
  if len(string) == 3:
    return False
  # eg 'ROAR'
  if len(string) == 4:
    # First 3 mutually unique, and first and last same.
    return (string[0] != string[1] and
      string[1] != string[2] and
      string[0] != string[2] and
      string[0] == string[3])

  # Throw out everything that isnt one of the known lengths.
  uniques_count = length_to_uniques_count(len(string))
  if uniques_count == None:
    return False

  # After all the speedup hurdles, check all adjacencies
  seen_edges = []
  for index, char in enumerate(string):
    # If we reach last char, we have seen all pairs
    if index == len(string)-1:
      break

    nextchar = string[index+1]
    if char == nextchar:
      return False

    pair = char + nextchar
    flipped_pair = pair[::-1]  # eg 'TK' -> 'KT'

    # TODO: This boolean expression could probably be sped up slightly
    if pair in seen_edges or flipped_pair in seen_edges:
      return False
    else:
      seen_edges.append(pair)

  # Passed all checks
  return True

def is_partial_eodermdrome(string):
  pass

def naive_eodermdromes(length=4, filename='/usr/share/dict/words'):
  eodermdromes = []
  with open(filename) as file:
    words = file.read().splitlines()
    for word in words:
      if len(word) == length:
        if is_eodermdrome(word):
          print(word)
          eodermdromes.append(word)

  return eodermdromes

def completions(partial='', words=[], targetlength=11):
  pass

def find_eodermdromes(filename='/usr/share/dict/words', targetlength=11):
  eodermdromes = []
  with open(filename) as file:
    words = file.read().splitlines()
    for word in words:
      pass
