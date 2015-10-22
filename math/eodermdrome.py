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

def uniques_count_to_eodermdrome_length(uniques_count):
  # vertex_circuit_length = uniques_count
  # circuits_count = uniques_count // 2
  # return vertex_circuit_length * circuits_count + 1
  return (uniques_count**2 - uniques_count) / 2.0 + 1

# special cases 0 and 2, and (k**2 - k) / 2 + 1 where k is a positive odd integer
small_eodermdrome_lengths = [0, 1, 2, 4, 11, 22, 37, 56, 79]

# Accepts '', 'A', 'AS', 'ASIA', etc
def is_eodermdrome(string):
  string = string.strip().upper()

  # Remove interior whitespace
  string = ''.join(char for char in string if char != ' ')

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

  # For all except very long strings, throw out everything that isnt one of the known lengths.
  if (len(string) <= small_eodermdrome_lengths[-1] and
      len(string) not in small_eodermdrome_lengths):
    return False

  # TODO: this hurdle probably takes about as long as the main loop. Needed?
  uniques_count = uniquetypes(string)
  if len(string) != uniques_count_to_eodermdrome_length(uniques_count):
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

results = naive_eodermdromes(4)
