#!/usr/bin/python

# roguelike early stages

import random
from random import choice

SPAWNCHANCE = 0.25
STARTINGMOOKS = 2

def rollD6s(diceCount):
  sum = 0
  for d in range(diceCount):
    sum += random.randint(1,6)
  return sum

# later move naked methods into a class Bot, etc:
def randomaction(creature, gamestate):
  # random actions for now. Written before creatures have foe or team fields.
  roll = random.randrange(100)
  if creature.spot.containsfoeof(creature):
    # add opportuinty attacks in gamestate move methods +++
    if roll < 10:
      # move to random spot
      gamestate.moveCreatureToSpot(creature, choice(gamestate.spots))
      print ''
    else:
      # fight in close combat
      # later, attack random foe (or creature) in this spot ++++
      # for now, just attack player (who we know is there because containsfoeof
      # checks for player in debug builds)
      creature.attack(gamestate.player)
      pass
  else:
    if roll < 50:
      # move to random spot
      gamestate.moveCreatureToSpot(creature, choice(gamestate.spots))
      print ''
    else:
      # shoot
      creature.attack(gamestate.player)
      # later, attack random spot ++++
      pass
  pass

class Item:
  def __init__(self, name, close, ranged):
    self.name = name
    self.closecombat = close
    self.rangedcombat = ranged
  
  def tostring(self):
#    return self.name + ' (CQC ' + str(self.closecombat) + ', RNG ' + str(self.rangedcombat) + ', RLD 20)'
    return self.name + ' (cqc ' + str(self.closecombat) + ', rng ' + str(self.rangedcombat) + ', rld 20)'
  
  
  itemtypes = []
  
  ''' name,       closecombat, rangedcombat 
    later, add spawn weight, shots per reload, monetary value, carrying weight, tags '''
  itemtypesstring = '''
    autopistol    3 2
    autogun       2 4
    autocannon    0 7
    
    laspistol     3 1
    lasgun        3 4
    lasrifle      3 4
    lascannon     0 7
    
    meltagun      2 5
    
    plasma pistol 2 3
    plasma gun    1 5
    
    hand flamer   4 0
    flamer        5 4
    heavy flamer  4 6
    
    bolt pistol   3 4
    bolter        3 5
    heavy bolter  1 6
    
    shotgun       5 1
    sniper rifle  1 6
    
    gentleman's sword 3 0
    power sword   6 0
    
    frag grenades 0 3
    '''

  @classmethod
  def readitemtypesfromstring(cls, string):
    items = []
    lines = string.strip().splitlines()
    # for now, just close and ranged stats
    for line in lines:
      if line.strip() == '':
        continue
      words = line.strip().split()
      if len(words) < 3:
        print 'Error, line in itemtypes string is weirdly short.'
        return
      name = ' '.join(words[:-2])
      closecombat = int(words[-2])
      rangedcombat = int(words[-1])
      items.append(Item(name, closecombat, rangedcombat))
    return items

  @classmethod
  def random(cls):
    # random item
    if Item.itemtypes == []:
      Item.itemtypes = Item.readitemtypesfromstring(Item.itemtypesstring)
    return choice(Item.itemtypes)


#class Weapon(Item):


# An abstract location 3 to 30 square meters in area
class Spot:
  def __init__(self):
    self.name = str(random.randrange(999))
    self.items = []  #Item('') for i in range(2)]
    self.creatures = []

  # debug: spots named after numbers
  def __init__(self, number):
    self.name = str(number)
    self.items = []  #Item('') for i in range(2)]
    self.creatures = []

  def containsfoeof(self, creature):
    for c in self.creatures:
      # for now, just look for name +++
      if c.name.endswith('figure'):
        return True
    else:
      return False

class Creature:
  def __init__(self):
    self.name = 'unknown creature'
    #self.shortname = '?'
    self.items = []
    self.closecombat = 1
    self.spot = None 
    pass
  
  # or put this code in Gamestate?
  def die(self):
    # debuggy, identify player by name (cause dont have pointer to self.player):+++
    if self.name.endswith('figure'):
      print '==================== GAME OVER ====================\n'
    here = self.spot
    here.items.extend(self.items)
    #here.items.append(Item(self.name + ' corpse'))
    here.creatures.remove(self)
    # here.maybedelete()
    self.name = ''
    self.items = []
    self.spot = None
  
  def attack(self, target):
    if self.spot == target.spot:
      # close combat
      # later, rules for equipping things maybe
      # later, store which weapon is used so we can print it
      bestclosevalue = 0
      for item in self.items:
        if item.closecombat > bestclosevalue:
          bestclosevalue = item.closecombat
          break
      closehitDC = 16 #debug
      dieroll = rollD6s(3)
      print '  The {} attacks the {}... (Rolls {} +{} from weapon, trying to get {} or higher...)'.format(
              self.name, target.name, str(dieroll), str(bestclosevalue), str(closehitDC))
      closehits = (dieroll + bestclosevalue >= closehitDC)
      
      if closehits:
        print '  The ' + target.name + ' is knocked out by the ' + self.name + ' & falls with a cry!'
        target.die()
      else:
        print '  The {} weathers the hail of attacks without injury'.format(target.name)
      pass
    else:
      # ranged combat
      # later, rules for equipping things
      bestrangedvalue = 0
      for item in self.items: 
        if item.rangedcombat > bestrangedvalue:
          bestrangedvalue = item.rangedcombat
          break
      if bestrangedvalue == 0:
        print '  You don\'t have any ranged weapons! \n' # should check this earlier
        return # but don't consume an action/turn
      
      hitDC = 16 # debug
      dieroll = rollD6s(3)
      print '  The {} attacks the {}... (Rolls {} +{} from weapon, trying to get {} or higher...)'.format(
              self.name, target.name, str(dieroll), str(bestrangedvalue), str(hitDC))
      hits = (dieroll + bestrangedvalue >= hitDC)

      if hits:
        print '  The ' + target.name + ' is shot by the ' + self.name + ' & falls with a cry!'
        target.die()
      else:
        print '  You miss! How could you miss?'
    print ''

class Player(Creature):
  def __init__(self):
    #super(self).init()
    self.name = 'mysterious, stylish figure'
    #   self.shortname = 'P'
    self.items = [Item.random()]
    self.closecombat = 2
    self.spot = None    # neater to do this using super() or something? +++
    pass

  def printItems(self):
    print 'Currently carrying:'
    if len(self.items) == 0:
      print ' Nothing'
    else:
      for item in self.items:
        print ' ' + item.tostring()
    print ''

class Mook(Creature):
  def __init__(self):
    self.name = 'Dominium commando #' + str(random.randint(0, 100))
    self.items = [Item.random()]
    self.closecombat = 1
    self.spot = None
    pass

class Gamestate:
  def look(self):
    for spot in self.spots:
      #if len(spot.creatures)==1 and spot.creatures[0]==self.player:
      #  continue
      print ' Spot ' + spot.name + ':'
      for creature in spot.creatures:
        if len(creature.items) <= 0:
          print '  ' + creature.name
        else:
          print '  ' + creature.name + ' w/ ' + creature.items[0].name
      print ''
  
  # Kindof for debug
  @staticmethod
  def groundItemsAtStart():
    return [Item.random() for i in range(4)]

  def moveCreatureToSpot(self, mover, spot):
    oldspot = mover.spot
    if oldspot != None:
      oldspot.creatures.remove(mover)
    mover.spot = spot
    spot.creatures.append(mover)
    print mover.name + ' moves to spot #' + spot.name

  # TODO: have this call moveCreatureToSpot instead +++
  def moveCreatureToCreature(self, mover, greeter):
    newspot = greeter.spot
    if greeter.spot == None:
      print 'Error: creature location unknown' 
      return 
    oldspot = mover.spot
    if oldspot != None:
      oldspot.creatures.remove(mover)
    mover.spot = newspot
    newspot.creatures.append(mover)

  ''' deprecated: now we use a fixed number of Spots 
  def moveCreatureToNewSpot(self, mover):
    oldspot = mover.spot
    if oldspot != None:
      oldspot.creatures.remove(mover)
    newspot = Spot()
    self.spots.append(newspot)
    newspot.creatures.append(mover)
    mover.spot = newspot
    '''

  def __init__(self):
    self.spots = []
    for s in range(4):
      self.spots.append(Spot(s))
    self.player = Player()
    self.moveCreatureToSpot(self.player, self.spots[0])
    for c in range(STARTINGMOOKS):
      self.moveCreatureToSpot(Mook(), self.spots[-1])
    pass

  # Returns True if item was moved, else false
  def creatureTakeItem(self, itemString, creature):
    for item in creature.spot.items:
      if item.name==itemString:   # Do i have to check ground isn't empty? 
        creature.items.append(item)
        creature.spot.items.remove(item)
        return True
    else: 
      print 'Specified item is not present at this location & thus can\'t be taken.\n'
      return False

  def creatureDropItem(self, itemString, creature):
    for item in creature.items:
      if item.name==itemString:
        creature.spot.items.append(item)
        creature.items.remove(item)
        return True
    else: 
      print 'Specified item is not in inventory & thus can\'t be dropped.\n'
      return False

  # Each of the NPCs takes a turn
  # 2014-06-28: There is a bug where if an NPC takes a Move action, the next NPC is skipped.
  def npcturns(self):
    # clumsy iter thru spots for now +++ has defect of moving then going again.
    for spot in self.spots:
      for creature in spot.creatures:
        # assume nameless player is a dead player for now, ie game over state. 
        if self.player.name == '':
          return 
        if creature != self.player:
          print '   === {}\'s turn ==='.format(creature.name)
          randomaction(creature, self)
          # TODO: this has a largeish glitch where a npc could move to spot 3 then move again when this for loop gets back to it +++
       # print '  DEBUG: end of creature loop for {} \n'.format(creature.name)
    # now chance of spawning a new NPC
    if random.random() < SPAWNCHANCE:
      print 'Another creature joins the battle!'
      self.moveCreatureToSpot(Mook(), random.choice(self.spots))
    print '\n'
    self.look() # we only do this after the last npc turn

  def printItemsNearCreature(self, creature):
    print 'On the ground nearby:'
    if len(creature.spot.items) == 0:
      print ' Nothing'
    else:
      for item in creature.spot.items:
        print ' ' + item.tostring()
    print ''

  # Should this be just for user input or should npc actions be passed into this as strings? Ie make this not player specific? eh. 
  # Later, have it load up a mapping of possible english inputs to the appropriate methods (or Action objects? do i need to encode if it's a free action?)
  def processInput(self, rawInput):
    if rawInput == '':
      return 
    print '' 
    #    print 'debug: rawInput is ' + rawInput
    cmd = rawInput.lower().strip()
    #if cmd.startswith('look on the ground')
    #if cmd in ['look on the ground', 'look on the ground.', 'look ground', 'look floor']
    words = rawInput.lower().split()
    #if words[-1].startswith('ground'):
    # Commands like 'look':
    if cmd=='look':
      self.look()
    # If they said 'look ground', etc:
    elif (words[0]=='look' and words[-1].startswith('ground')) or cmd in ('ground', 'floor'):
      self.printItemsNearCreature(self.player)
    # Commands like 'items' or 'inventory' or 'look items':
    elif words[-1] in ('items', 'inventory'):
      self.player.printItems()
    # Commands like 'take plasma rifle':
    elif words[0]=='take':       # or cmd.startswith('pick up'):+++
      # methodize so can do both take and pick up +++ 
      successful = self.creatureTakeItem(' '.join(words[1:]), self.player)
      if successful:
        self.player.printItems()
        # each nonplayer creature gets a nonfree action
        self.npcturns()
    elif words[0] in ('drop', 'discard'):
      successful = self.creatureDropItem(' '.join(words[1:]), self.player)
      if successful:
        self.player.printItems()
        # should this end your turn?
    # Commands like 'move 540' # later, deal with awkward spot id number puzzle
    elif words[0] in ('move', 'go') and len(words) >= 2:
      for spot in self.spots:
        if spot.name == words[-1]:
          self.moveCreatureToSpot(self.player, spot)
          print ''
          self.look()
          # ends the player's turn
          self.npcturns()
          break
    # Commands like 'attack 2' or 'shoot 0'
    # for now, specify name of spot and you attack random foe there
    elif (words[0]=='attack' or words[0]=='shoot') and len(words) >= 2:
      # methodize all this? 
      spotidentifier = words[-1]
      # relies on assumption that spots are named and numbered 0,1,2, etc
      targetspot = self.spots[int(spotidentifier)]
      candidates = []
      if targetspot == self.player.spot:
        # close combat
        for creature in targetspot.creatures:
          if creature != self.player:
            candidates.append(creature)
      else:
        # ranged combat
        candidates = targetspot.creatures
      if len(candidates) == 0:
        print 'Sorry, there is no one to attack in that spot \n'
        return # doesn't cost an action
      # finally, attack
      self.player.attack(choice(candidates))
      self.look()
      # ends the player's turn
      self.npcturns()
    # TODO: methodize the above 2-word attack so you can also have 'fight' or 'punch' refer to current location +++
    # debug action for telling all npcs to take a turn
    elif cmd in ('go', 'end turn', 'endturn', 'done', 'wait', 'delay', 'npcturns'):
      self.npcturns()
    # and many more commands...
    else:
      print 'Sorry, input not recognized. \n'

  def run(self):
    print ''
    self.player.printItems()
    while(True):
      print ''
      rawInput = raw_input('> ')
      print ''
      self.processInput(rawInput)

# Game start code
gamestate = Gamestate()
gamestate.run()




'''
  todo:
  -roll random weapon
  -ability to encode what weapons can be rolled
  -maybe spots as NEWS-connected nodes
   -print in text boxes, up right left down 
   -gen as you explore 
  -NPCs can fight in melee
  -cover, differences between spots
  -less glitchy npc turns
  -automatic npc turns
   -code in actions and free actions more rigorously? 
  -things i might want to methodize
   -printing messages to user
   -actions, unfree actions as free (opportunity attack), etc
   -standardized way of listing and enumerating all Xs in a Y, referring to one, then zooming in.
  -multiple files? not all one big file? what stuff could best be split off?
  -look for pluspluspluss in current code
  -use git? committing too bothersome? could give me practice i guess
  







  
  #      self.name = random.choice(['sniper rifle', 'medkit', 'pulse rifle', 'grenade', 'breastplate', 'datapad', 'pistol', 'shortsword', 'hand shield', 'helmet', 'plasma spear', 'scrap of parchment', 'lotus'])
old: 
debug: 
# player examines inventory 
player.printItems()
# player looks
gamestate.printGroundItems()
'''


