#!/usr/bin/python

'''
based on notes in 2013-10-09 work offtopic (not yet on this laptop) about 
relatively realist superheros and scifi adventurers
'''
from randomtree import Table
#import randomtree

# temp: global
nameadj = Table("nameadj.txt")
namenoun = Table("namenoun.txt")
weapontable = Table("weapons.txt")
wearingtable = Table("wearing.txt")
carryingtable = Table("carrying.txt")
pronountable = Table("pronouns.txt")

class Character:
 def __init__(self):
  self.nameadj = nameadj.string()
  self.namenoun = namenoun.string()
  self.weapon = weapontable.string()
  self.wearing = wearingtable.string()
  self.carrying1 = carryingtable.string()
  self.carrying2 = carryingtable.string()
  self.pronoun = pronountable.string()

# temp: not OO
def quickbio(character, sentencestart):
 return '''{nameadj} {namenoun} is wearing {wearing} & fights with {weapon}. {pronoun} is also carrying {carrying1} & {carrying2}.'''.format(nameadj=character.nameadj, namenoun=character.namenoun, wearing=character.wearing, weapon=character.weapon, pronoun=character.pronoun, carrying1=character.carrying1, carrying2=character.carrying2)
 
leader = Character()
loveinterest = Character()
ally = Character()
 
print '''Two warriors circle warily.'''
print quickbio(leader, 'One')
print quickbio(loveinterest, 'Another')

'''
class CharacterGen:
 def __init__():
  self.weaponstable = new Table("weapons.txt")
  self.wearingtable = new Table("wearing.txt")
  self.carryingtable = new Table("carrying.txt")
  '''
  







