#!/usr/bin/python

'''
Skeleton for genregens / random generators
To use: Put a copy of this file in the dir, next to the tables as txt files. The file describing the main format of your generated strings should be called output.txt and should contain at least one line something like '9 {adj} {noun}'. (Then ofc you would need more tables adj.txt and noun.txt, etc.) 

Original of file created 2013-11-18 by Alex Pearson
'''

from random import choice
from random import randint

outputscount = 2
rewardsize = 3

class Result:
  def __init__(self, text, filename, linenum):
    self.text = text
    self.filename = filename
    self.linenum = linenum

class Table:
  def __init__(self, filename): 
    self.results = []
    with open(filename) as file:
      lines = file.read().splitlines()
      for linenum, line in enumerate(lines):
        words = line.split()
        if len(words) < 2:
          continue
        text = ' '.join(words[1:])
        tempresult = Result(text, filename, linenum)
        weight = int(words[0])
        for i in range(weight):
          self.results.append(tempresult)

  def result(self):
    return choice(self.results)

class Output:
  def fillblanks(self):
    leftbracket = self.text.find('{')
    if leftbracket > -1:
      rightbracket = self.text.find('}')
      tablename = self.text[leftbracket+1 : rightbracket]
      slottable = Table(tablename + '.txt')
      self.results.append(slottable.result())
      # Replace bracket-to-bracket text with Result text (in real output.text)
      self.text = self.text[:leftbracket]  + self.results[-1].text + self.text[rightbracket+1 :]
      self.fillblanks()

  # took out color codes
  # 2013-12-10. Something goes wrong combined with the color code stuff. The code for the esc character is 4 characters but gets shrunk into one and that throws stuff off. Also the color codes contain the '[' character. i added start for this. 
  # Fill in blanks of the format [herself/himself]. Only used for gender for now. You can use either order so long as you're consistent. Parameter 'which' is a 0 or 1 and determines whether you use the left or right pronoun. (0 is left/first). Param 'start' says to only consider characters after that index (this is used to ignore '['s in color codes). 
  def fillsquarebrackets(self, which):
    leftbracket = self.text.find('[')
    if leftbracket > -1:
      slash = self.text.find('/')
      rightbracket = self.text.find(']')
      if which == 0:
        chosen = self.text[leftbracket+1 : slash]
      else:
        chosen = self.text[slash+1 : rightbracket]
      t = self.text
      self.text = t.replace(t[leftbracket : rightbracket+1], chosen)
      self.fillsquarebrackets(which)

  def __init__(self, textin):
    self.text = textin
    self.results = []
    self.fillblanks()
    self.fillsquarebrackets(choice([0,1]))

  # Reward the Output, ie all its rolls. 
  def reward(self):
    for result in self.results:
      with open(result.filename, 'r') as file:        
        lines = file.read().splitlines()
        chosenline = lines[result.linenum]
        # debug: should maybe print line, what we will replace it with 
        firstspace = chosenline.find(' ')
        oldweight = int(chosenline[:firstspace])
        # now write back the new line 
        lines[result.linenum] = str(oldweight+rewardsize) + chosenline[firstspace:]
      with open(result.filename, 'w') as file:
        file.write('\n'.join(lines))

# interactive gen, tree

# ugly global
typestable = [] # of Nodetype objects

def typefromname(name):
  for type in typestable:
    if type.name == name:
      return type
#  else:
#    print 'btw: node type "' + name + '" not found'

class Childtype:
  def __init__(self, name, min, max):
    self.name = name
    self.min = min
    self.max = max

class Nodetype:
  ''' a structure.txt entry might look like:
    
  region
  biome 1 to 1
  racepresence 0 to 3

  '''
  def __init__(self, string):
    lines = string.splitlines()
    self.name = lines[0].strip()
    self.childtypes = []
    for l in range(1, len(lines)):
      words = lines[l].split()
      if len(words) < 4 or words[-2] != 'to':
        print 'Error: structure.txt in unexpected format.'
        return
      childname = ' '.join(words[:-3])
      self.childtypes.append(Childtype(childname, int(words[-3]), int(words[-1])))
  

# one node in the generated tree
class Node:
  def __init__(self, outputname, children):
    self.output = Output('{' + outputname + '}')
    self.children = children
  
  @classmethod
  def fromnodetype(nodeClass, nodetype):
    newchildren = []
    for childtype in nodetype.childtypes:
      for i in range(randint(childtype.min, childtype.max)):
        nodetypeofchild = typefromname(childtype.name)
        if nodetypeofchild == None:
          # if it's not listed in the typestable, ie if it's a Childtype not a Nodetype, it's a leaf. clumsy? 
          newchildren.append(nodeClass(childtype.name, []))
        else:
          # if the child is a Nodetype ie a nonleaf 
          newchildren.append(nodeClass.fromnodetype(nodetypeofchild))
    return nodeClass(nodetype.name, newchildren)

def printTreeRecursor(node, indent):
  for i in range(indent):
    print ' ',
  print node.output.text
  for child in node.children:
    printTreeRecursor(child, indent+1)

# just print it for now, before REPL is implemented.
def printTree(node):
  print('')
  printTreeRecursor(node, 0)
  print('')

# not sure how to organize, but here is alg
def parsestructurefile():
  with open('structure.txt') as structurefile:
    entries = structurefile.read().split('\n\n')
    for entry in entries:
      typestable.append(Nodetype(entry))

# run
parsestructurefile()
root = Node.fromnodetype(typestable[0]) # first entry assumed to be root type
printTree(root)
      
      
      











