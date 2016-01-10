# alternate d&d planescape

# TODO: maybe i should always store traits as eg 'air',
# & just have a dict that converts to the fancy adjs.
'''
opts
. law_chaos : Axis object
. law : Axis object
. law_chaos : law
 . and a global mapping from 'law' to 'axiomatic'
 . or law_chaos : Law (a Alignment object)
  . which stores its adjectives
. just law (ie list not dict)
 . and functions have to infer
. (law, chaos) : law in plane.axes
 . with map from law : axiomatic
 . AXES contains 2-tuples

i think we need to be able to map
from alignment to axis
and axis to alignment.
'''

# haven't decided whether to use this or not.
class Alignment:
  def __init__(self, name, *adjs):
    pass

class Axis:
  def __init__(self, concepta, conceptb, adja, adjb):
    self.concepta = concepta
    self.conceptb = conceptb
    self.adja = adja
    self.adjb = adjb
    self.key = '{a}_{b}'.format(a=concepta, b=conceptb).lower()
    self.verbose_name = '{a} vs {b}'.format(
      a=concepta.capitalize(), b=conceptb.capitalize())

# Policy: Store all strings in lowercase (except verbose_name),
# & call .capitalize() when showing to user.

AXES = [
  # axiomatic immaculate elemental
  Axis('law', 'chaos', 'lawful', 'chaotic'),
  
  # virile natal lethal fatal
  Axis('birth', 'death', 'fertile', 'entropic'),
  
  # ignic
  Axis('fire', 'ice', 'igneous', 'cryonic'),
  
  # luminescent occulted obscure
  Axis('light', 'dark', 'luminous', 'occult'),
  
  # terran aetheric aetherial celestial
  Axis('earth', 'air', 'cthonic', 'zephyric'),
  
  # logical apollonian
  # vigorous flourishing robust dionysian
  Axis('reason', 'energy', 'rational', 'vital'),
  
  # united vs divided
  # selfish defecting cooperating
  Axis('self', 'others', 'individual', 'communal'),
  
  # beatific virtuous
  # diabolical
  Axis('good', 'evil', 'beatific', 'diabolical'),
  
  # axiomatic naive virginal inviolate immaculate
  # developed ornate baroque evolved
  Axis('simple', 'complex', 'elemental', 'byzantine'),

  # new newborn youthful stainless unstained unblemished 
  # antique archaic timeworn venerable ancient primeval primordial
  Axis('young', 'old', 'virginal', 'antediluvian')
]

class Plane:
  def __init__(self, name, *concepts):
    self.name = name
    self.axes = {}

    for concept in concepts:
      for axis in AXES:
        if axis.concepta == concept:
          self.axes[axis.key] = axis.adja
          break
        elif axis.conceptb == concept:
          self.axes[axis.key] = axis.adjb
          break
      else:
        print('note: concept not found on the known axes')

  def __str__(self):
    title = '{name}'.format(name=self.name.capitalize())

    if len(self.axes) == 0:
      traitlist = 'True Neutral'
    else:
      traits = [ '  '+name+': '+adj.capitalize() for name,adj in self.axes.items() ]
      traitlist = '\n'.join(traits)

    return '{title}:\n{traitlist}'.format(title=title, traitlist=traitlist)

PLANES = [
  Plane('ysgard', 'chaos', 'birth', 'good', 'air'),
  Plane('celestia', 'law', 'good', 'air', 'communal', 'reason', 'light', 'fire'),
  Plane('abyss', 'chaos', 'evil', 'dark', 'earth', 'energy', 'complex', 'birth'),
  Plane('baetor', 'law', 'evil', 'dark', 'fire', 'earth', 'complex', 'self', 'old')
]

def axisof(alignment):
  # TODO: improve this hacky [0] syntax. (not important right now.)
  return filter(AXES, lambda a: a.concepta == alignment or a.conceptb == alignment)[0]

# This function expects keys like 'fire_ice'
def alignmentsof(axiskey):
  return axiskey.split('_')

def planes_with_trait(trait):
  # TODO
  chosenplanes = []
  for plane in PLANES:
    # if trait in plane.axes.values():
    pass # TODO adj vs trait....
    chosenplanes.append(plane)
  return chosenplanes

def planes_with_axis(axisname):
  return [p for p in PLANES if axisname in p.axes]



# run
for plane in PLANES:
  print(plane)
  print('')

print(planes_with_axis('reason_energy'))
