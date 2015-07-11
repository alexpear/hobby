#!/usr/bin/python

from random import choice
import StringIO

class Result:
  def __init__(self, words):
    self.name = ''
    self.tags = []
    for word in words: 
      if word[0] == '#':
        self.tags.append(word[1:])
        # and i'll deal with value tags later
      else:
        self.name += word + ' '
    if self.name[-1] == ' ':
      self.name = self.name[:-1]    # remove trailing space

  # def duplicate(self):

class Table:
  def __init__(self, filename):
    self.results = []
    with open(filename) as file:
      lines = file.read().splitlines()
      for line in lines:
        words = line.split()
        if len(words) < 2:
          continue
        tempresult = Result(words[1:])
        weight = int(words[0])
        for i in range(weight):
          self.results.append(tempresult)

  def result(self):
    return choice(self.results)

  def string(self):
    return choice(self.results).name

