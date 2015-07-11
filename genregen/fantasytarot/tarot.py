#!/usr/bin/python

# generates descriptions of things by generating random sets of archetypes/imagery-units 

from randomtree import Table

willtable = Table('worldtarot.txt')

# a protagonist sees a vision of a new world. suggested name: Will (from The Dark Is Rising). 
def willvision(seer):
 print '''{name} looks into the whirlpool & sees a world of {one}, {two}, & {three}. The world has {core} at its core & {outskirts} all around. {name} sees {below} below & {above} above. In the past, it had {past}, and it has a future of {future}. Few know of the hidden {hidden}. Though considered unremarkable by locals, {name}'s attention is drawn to the {unremarkable}.'''.format(name=seer, one=willtable.string(), two=willtable.string(), three=willtable.string(), below=willtable.string(), above=willtable.string(), core=willtable.string(), outskirts=willtable.string(), past=willtable.string(), future=willtable.string(), hidden=willtable.string(), unremarkable=willtable.string())

print willvision('Will')





