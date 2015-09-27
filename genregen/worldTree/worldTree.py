#!/usr/bin/python

'''
Skeleton for genregens / random generators
To use: Put a copy of this file in the dir, next to the tables as txt files. The file describing the main format of your generated strings should be called output.txt and should contain at least one line something like '9 {adj} {noun}'. (Then ofc you would need more tables adj.txt and noun.txt, etc.) 

Original of file created 2013-11-18 by Alex Pearson
'''

import json
from random import choice
from random import randint

class Result:
  def __init__(self, text, fileName, lineNum):
    self.text = text
    self.filename = fileName
    self.lineNum = lineNum

class Table:
  def __init__(self, fileName):
    self.results = []
    with open(fileName) as file:
      lines = file.read().splitlines()
      for lineNum, line in enumerate(lines):
        words = line.split()
        if len(words) < 2:
          continue
        text = ' '.join(words[1:])
        tempResult = Result(text, fileName, lineNum)
        weight = int(words[0])
        for i in range(weight):
          self.results.append(tempResult)

  def result(self):
    return choice(self.results)

class Output:
  def fillBlanks(self):
    leftBracket = self.text.find('{')
    if leftBracket > -1:
      rightBracket = self.text.find('}')
      tableName = self.text[leftBracket+1 : rightBracket]
      slotTable = Table(tableName + '.txt')
      self.results.append(slotTable.result())
      # Replace bracket-to-bracket text with Result text (in real output.text)
      self.text = self.text[:leftBracket] + self.results[-1].text + self.text[rightBracket+1 :]
      self.fillBlanks()

  # took out color codes
  # 2013-12-10. Something goes wrong combined with the color code stuff. The code for the esc character is 4 characters but gets shrunk into one and that throws stuff off. Also the color codes contain the '[' character. i added start for this. 
  # Fill in blanks of the format [herself/himself]. Only used for gender for now. You can use either order so long as you're consistent. Parameter 'which' is a 0 or 1 and determines whether you use the left or right pronoun. (0 is left/first). Param 'start' says to only consider characters after that index (this is used to ignore '['s in color codes). 
  def fillSquareBrackets(self, which):
    leftBracket = self.text.find('[')
    if leftBracket > -1:
      slash = self.text.find('/')
      rightBracket = self.text.find(']')
      if which == 0:
        chosen = self.text[leftBracket+1 : slash]
      else:
        chosen = self.text[slash+1 : rightBracket]
      t = self.text
      self.text = t.replace(t[leftBracket : rightBracket+1], chosen)
      self.fillSquareBrackets(which)

  def __init__(self, textIn):
    self.text = textIn
    self.results = []
    self.fillBlanks()
    self.fillSquareBrackets(choice([0,1]))


# interactive gen, tree

# ugly global
typesTable = [] # of Nodetype objects

def typeFromName(typeName):
  for typeDict in typesTable:
    if typeDict['name'] == typeName:
      return typeDict


''' a structure.txt entry might look like:

region
biome 1 to 1
racePresence 0 to 3
'''
def makeNodeTypeDict(string):
  lines = string.splitlines()
  typeDict = {
    'name': lines[0].strip(),
    'childProfiles': []
  }

  for line in lines[1:]:
    words = line.split()
    if len(words) < 4 or words[-2] != 'to':
      print('error: structure file not in the expected format. was expecting "location 0 to 3" etc.')
      return

    childProfile = {
      'name': ' '.join(words[:-3]),
      'min': int(words[-3]),
      'max': int(words[-1])
    }

    typeDict['childProfiles'].append(childProfile)

  return typeDict

def nodeFromTypeName(typeName):
  description = Output('{'+typeName+'}').text
  return {
    'description': description,
    'children': []
  }

def nodeFromType(nodeType):
  node = nodeFromTypeName(nodeType['name'])

  for childProfile in nodeType['childProfiles']:
    childName = childProfile['name']
    nodeTypeOfChild = typeFromName(childName)
    repeats = randint(childProfile['min'], childProfile['max'])
    for i in range(repeats):
      if nodeTypeOfChild:
        # if we found a nodeType on file, then it's an interior node.
        newChild = nodeFromType(nodeTypeOfChild)
      else:
        # if it's not listed in the typestable, then it's a leaf type.
        newChild = nodeFromTypeName(childName)

      node['children'].append(newChild)

  return node

def printTreeRecursor(node, indent):
  for i in range(indent):
    print '  ',
  print(node['description'])
  for child in node['children']:
    printTreeRecursor(child, indent+1)

# just print it for now, before REPL is implemented.
def printTree(node):
  print('')
  printTreeRecursor(node, 0)
  print('')

# TODO: make more flexible and probably more object oriented.
def parseStructureFile():
  with open('structure.txt') as structureFile:
    entries = structureFile.read().split('\n\n')
    for entry in entries:
      typesTable.append(makeNodeTypeDict(entry))

def newTree():
  return nodeFromType(typesTable[0]) # first entry assumed to be root type

def toJson(node):
  return json.dumps(node)

def fromJson(jsonString):
  return json.loads(jsonString)

# run
parseStructureFile()
root = newTree()
printTree(root)


'''
short term TODO
- TreeExplorer obj. Stores a tree, list of ptrs to each node in tree, and currentNode ptr.
  - navigation functions. ls(), up(), go(which) etc
  - reroll() function, which regens currentNode and its subtree.
- standardize camelCase
- later: rewrite in JS?
  - web interface?
    - saving by... pasting?
      - URL?
      - something more elaborate?
'''











