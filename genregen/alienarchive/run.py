#!/usr/bin/python

import randomtree
import rorschach
import StringIO

# prints a metagrid of many rorschachs
def printrorschachs(rows, cols):
  # work comp, 140 x 150 ish, before spacer rules change
  charsperrow = 80
  charspercol = 80
  schachsperrow = charsperrow / (rows + 3)
  schachspercol = charspercol / (cols + 3) # or +1? 
  metagrid = [ [rorschach.rorschach(rows,cols) for c in range(schachsperrow)] for r in range(schachspercol)]
  out = StringIO.StringIO()
  for metarow in metagrid:
    for r in range (rows):
      for grid in metarow:
        for c in range(cols):
          if grid[r][c]:
            out.write(unichr(0x2588))
          else:
            out.write(' ')
        out.write(' | ')
      out.write('\n')
    spacer = '\n' + ('-' * (charsperrow * 2)) + '\n'
    out.write(spacer)
  print out.getvalue()
 
adjs = randomtree.Table('adjs.txt')
nouns = randomtree.Table('nouns.txt')

#print 'This is the story of \n'
print '\n'
print rorschach.gridstr(rorschach.rorschach(5,5))
print '{adj} {noun} \n'.format(adj = adjs.string(), noun = nouns.string())
# print '\n     and \n\n'
# print rorschach.gridstr(rorschach.rorschach(5,5))
# print '  {adj} {noun} \n'.format(adj = adjs.string(), noun = nouns.string())


# printrorschachs(6, 7)

