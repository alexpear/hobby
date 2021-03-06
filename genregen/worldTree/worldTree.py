#!/usr/bin/python

'''
Skeleton for genregens / random generators
To use: Put a copy of this file in the dir, next to the tables as txt files. The file describing the main format of your generated strings should be called output.txt and should contain at least one line something like '9 {adj} {noun}'. (Then ofc you would need more tables adj.txt and noun.txt, etc.) 
'''

import pickle
from random import choice
from random import randint

class Util:
  # Users count 1,2,3 while programmers count 0,1,2
  # Kind of silly but helps me remember
  @staticmethod
  def toUserNumbering(n):
    return n + 1

  @staticmethod
  def fromUserNumbering(n):
    if n == 0:
      print('error: zero passed to fromUserNumbering()')
      return
    return n - 1

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


class TreeSpace:
  '''
  a structureFile entry might look like this:
  region
  biome 1 to 1
  racePresence 0 to 3
  '''
  @staticmethod
  def makeNodeTypeDict(string):
    lines = string.splitlines()
    typeDict = {
      'name': lines[0].strip(),
      'childProfiles': []
    }

    for line in lines[1:]:
      words = line.split()
      if len(words) < 4 or words[1] != 'to':
        print('error: structure file not in the expected format. was expecting "0 to 1 personality summary" etc.')
        return

      typeName = ' '.join(words[3:])
      # Disambiguate aliases.
      if typeName[0] == '{' and typeName[-1] == '}':
        typeName = Output(typeName).text

      childProfile = {
        'min': int(words[0]),
        'max': int(words[2]),
        'name': ' '.join(words[3:])
      }

      typeDict['childProfiles'].append(childProfile)

    return typeDict

  @staticmethod
  def parseTypes(fileName='structure.txt'):
    allTypes = []
    with open(fileName) as structureFile:
      entries = structureFile.read().split('\n\n')
      for entry in entries:
        allTypes.append(TreeSpace.makeNodeTypeDict(entry.strip()))
    return allTypes

  def __init__(self):
    self.nodeTypes = TreeSpace.parseTypes()
    self.rootType = self.nodeTypes[0]

  def typeFromName(self, typeName):
    for typeDict in self.nodeTypes:
      if typeDict['name'] == typeName:
        return typeDict
    else:
      return None


class TreeExplorer:
  # This function does not generate the children of the node.
  @staticmethod
  def nodeFromTypeName(typeName, parent):
    description = Output('{'+typeName+'}').text
    return {
      'description': description,
      'typeName': typeName,
      'children': [],
      'parent': parent
    }

  def subtreeFromTypeName(self, typeName, parent):
    interiorType = self.typeFromName(typeName)
    if interiorType:
      # Node will be an interior node.
      return self.subtreeFromType(interiorType, parent)
    else:
      # Node is a leaf.
      return TreeExplorer.nodeFromTypeName(typeName, parent)

  # Convenience function
  def typeFromName(self, typeName):
    return self.treeSpace.typeFromName(typeName)

  def subtreeFromType(self, nodeType, parent):
    node = TreeExplorer.nodeFromTypeName(nodeType['name'], parent)

    for childProfile in nodeType['childProfiles']:
      childTypeName = childProfile['name']
      nodeTypeOfChild = self.typeFromName(childTypeName)
      repeats = randint(childProfile['min'], childProfile['max'])
      for i in range(repeats):
        if nodeTypeOfChild:
          # if we found a nodeType on file, then it's an interior node.
          newChild = self.subtreeFromType(nodeTypeOfChild, node)
        else:
          # if it's not listed in the typestable, then it's a leaf type.
          newChild = TreeExplorer.nodeFromTypeName(childTypeName, node)

        node['children'].append(newChild)

    return node

  def newTree(self):
    return self.subtreeFromType(self.treeSpace.rootType, parent=None)

  def subtreeFromOldSubtree(self, oldNode):
    return self.subtreeFromTypeName(oldNode['typeName'], oldNode['parent'])

  def __init__(self, treeSpace=TreeSpace()):
    self.treeSpace = treeSpace
    cachedTree = TreeExplorer.loadFromCache()
    if cachedTree:
      self.root = cachedTree
    else:
      self.root = self.newTree()
    self.currentNode = self.root

  # TODO: add extra newline when going back up multiple levels
  @staticmethod
  def printSubtreeRecursor(node, indent, maxIndent, siblingNumber=1):
    if indent > maxIndent:
      return

    indentUnit = '    '
    for i in range(indent):
      print(indentUnit, end='')

    # Prepend sibling number only for the direct children
    if indent == 1:
      print('{num} '.format(siblingNumber), end='')
    print(node['description'])
    for childIndex, child in enumerate(node['children']):
      TreeExplorer.printSubtreeRecursor(
        child, indent+1, maxIndent=maxIndent,
        siblingNumber=Util.toUserNumbering(childIndex))

  @staticmethod
  def printSubtree(node, depth=2):
    print('')
    TreeExplorer.printSubtreeRecursor(node, 0, maxIndent=2)
    print('')

  def printWholeTree(self):
    TreeExplorer.printSubtree(self.root)

  def ls(self):
    TreeExplorer.printSubtree(self.currentNode)

  def up(self):
    # If we're not at self.root, go up.
    if self.currentNode['parent']:
      self.currentNode = self.currentNode['parent']
    self.ls()

  # This function counts from 1,2,3...
  @staticmethod
  def getChild(node, childIndex):
    listIndex = Util.fromUserNumbering(childIndex)
    children = node['children']
    if listIndex >= len(children):
      print('child number ' + str(childIndex) + ' not found.')
      return None
    return children[listIndex]

  # We start indexing from 1 because this function is a non-technical user interface.
  def go(self, childIndex=1):
    child = TreeExplorer.getChild(self.currentNode, childIndex)
    if child:
      self.currentNode = child
    self.ls()

  # We start indexing from 1 because this function is a non-technical user interface.
  def reroll(self, childIndex=1):
    listIndex = Util.fromUserNumbering(childIndex)
    childrenList = self.currentNode['children']
    if listIndex >= len(childrenList):
      print('child number ' + str(childIndex) + ' not found.')
      return
    oldSubtree = childrenList[listIndex]
    newSubtree = self.subtreeFromOldSubtree(oldSubtree)
    childrenList[listIndex] = newSubtree
    self.ls()

  cacheFileName = 'wtCache.txt'

  # Store the current tree temporarily in a file.
  # This file is overwritten each time save() is called.
  def saveToCache(self, fileName=cacheFileName):
    pickledString = pickle.dumps(self.root)
    with open(fileName, 'w') as cacheFile:
      cacheFile.write(pickledString)

  @staticmethod
  def loadFromCache(fileName=cacheFileName):
    try:
      with open(fileName, 'r') as cacheFile:
        return pickle.load(cacheFile)
    except:
      print('(could not load from cache ' + fileName + ')')
      return None


explorer = TreeExplorer()
explorer.printWholeTree()


'''
short term TODO
- TreeExplorer obj. Stores a tree, list of ptrs to each node in tree, and currentNode ptr.
  - reroll() function, which regens currentNode and its subtree.
- standardize camelCase
- later:
  - neater file structure
  - reorder functions
  - rewrite in JS?
    - web interface?
      - saving by... pasting?
        - URL?
        - something more elaborate?
'''
