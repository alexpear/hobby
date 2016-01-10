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

def prettyprintlist(list):
  print('\n\n'.join(map(str, list)))

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
  ('law', 'chaos'),
  ('good', 'evil'),
  ('birth', 'death'),
  ('fire', 'ice'),
  ('light', 'dark'),
  ('earth', 'air'),
  ('reason', 'energy'),
  ('self', 'others'),
  ('simple', 'complex'),
  ('young', 'old')
]

alignment_to_adjective = {
  'law': 'lawful', # axiomatic immaculate
  'chaos': 'chaotic', # entropic elemental

  'birth': 'fertile', # virile natal
  'death': 'entropic', # lethal fatal

  'fire': 'igneous', # ignic
  'ice': 'cryonic',

  'light': 'luminous', # luminescent
  'dark': 'occult', # occulted obscure

  'earth': 'cthonic', # subterranean terran
  'air': 'aetheric', # aetherial celestial zephyric

  'reason': 'rational', # intellectual logical appolonian
  'energy': 'vital', # vigorous flourishing robust dionysian

  'self': 'individual', # divided selfish defecting
  'others': 'communal', # united cooperating

  'good': 'good', # beatific virtuous
  'evil': 'evil', # diabolical

  'simple': 'elemental', # axiomatic naive virginal inviolate immaculate
  'complex': 'byzantine', # developed ornate baroque evolved

  'young': 'virginal', # new newborn youthful stainless unstained unblemished
  'old': 'antediluvian' # antique archaic timeworn venerable ancient primeval primordial
}

def adjof(alignment):
  return alignment_to_adjective[alignment]

def axis_verbose(atuple):
  return '{a} vs {b}'.format(a=atuple[0].capitalize(), b=atuple[1].capitalize())

def axis_as_adjective_string(atuple):
  return '{a} vs {b}'.format(
    a=adjof( atuple[0] ).capitalize(),
    b=adjof( atuple[1] ).capitalize())

def axisof(alignment):
  # TODO: improve this hacky [0] syntax. (not important right now.)
  return filter(lambda axis: alignment in axis, AXES)[0]

class Plane:
  def __init__(self, name, *concepts):
    self.name = name
    self.axes = {}

    for alignment in alignments:
      # axis = filter((lambda axis: alignment in axis), AXES)[0]
      self.axes[axisof(alignment)] = alignment

  def __str__(self):
    title = '{name}'.format(name=self.name.capitalize())

    if len(self.axes) == 0:
      traitlist = 'True Neutral'
    else:
      traits = [
        '  ' + axis_verbose(atuple) + ': ' + adjof(alignment).capitalize()
          for atuple, alignment in self.axes.items()
      ]
      traitlist = '\n'.join(traits)

    return '{title}:\n{traitlist}'.format(title=title, traitlist=traitlist)

PLANES = [
  Plane('ysgard', 'chaos', 'birth', 'good', 'air'),
  Plane('celestia', 'law', 'good', 'air', 'communal', 'reason', 'light', 'fire'),
  Plane('abyss', 'chaos', 'evil', 'dark', 'earth', 'energy', 'complex', 'birth'),
  Plane('baetor', 'law', 'evil', 'dark', 'fire', 'earth', 'complex', 'self', 'old')
]

# Expects 'law' or 'air'
def planes_with_alignment(alignment):
  return [p for p in PLANES if alignment in p.axes.values()]

def planes_with_axis(axisname):
  return [p for p in PLANES if axisname in p.axes]



# run
for plane in PLANES:
  print(plane)
  print('')

print(planes_with_axis('reason_energy'))
