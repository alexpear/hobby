#!/usr/bin/python

'''
Skeleton for genregens / random generators
To use: Put a copy of this file in the dir, next to the tables as txt files. The file describing the main format of your generated strings should be called output.txt and should contain at least one line something like '9 {adj} {noun}'. (Then ofc you would need more tables adj.txt and noun.txt, etc.) 

Original of file created 2013-11-18 by Alex Pearson
'''

from random import choice

outputscount = 2
rewardsize = 3

class Result:
  def __init__(self, text, filename, linenum):
    self.text = text
    self.filename = filename
    self.linenum = linenum

  # add debug method to print linenum of file to make sure it's not off-by-one +++ 

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

  # Fill in blanks of the format [herself/himself]. Only used for gender for now. You can use either order so long as you're consistent. Parameter 'which' is a 0 or 1 and determines whether you use the left or right pronoun. (0 is left/first). 
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

# main method, not in a class for now
def presenttouser():
  while True:
    outputs = []
    for i in range(outputscount):
      outputs.append(Output('{output}'))
      print ''
      print i+1, outputs[i].text
    # we also have a none of the above:
    print ''
    print (outputscount+1), 'None of the above'
    print ''
    # wait for input 
    chosen = int(input('Which is the best? '))
    print ''
    if chosen <= 0:
      return  # Quit
    if chosen <= outputscount:
      outputs[chosen-1].reward()
    # if 'None of the above' do nothing

presenttouser()














