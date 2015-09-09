#!/usr/bin/python

# fully connected graph of 5 vertices. 
# given n random edges with replacement
# how many vertices are involved? 
# motivated by mtg ravnica drafts

def likelyhoods(playerCount):
    #              0  1  2  3  4  5 colors represented, no more no less
    likelyhoods = [0, 0, 0, 0, 0, 0]

    # We assume p1 is WU for simplicity
    # Top-level call of recursive function:
    addPlayers( ['WU'], playerCount-1, likelyhoods )

    return likelyhoods

# Recursive function because the number of loops is variable
def addPlayers(guildChoices, playersLeft, likelyhoods):
    guilds = ['WU', 'WB', 'WR', 'WG', 'UB', 'UR', 'UG', 'BR', 'BG', 'RG']
    if playersLeft <= 0:
        colorCount = len(colorsOf(guildChoices))
        likelyhoods[colorCount] += 1
    else:
        for newGuild in guilds:
            addPlayers(guildChoices + [newGuild], playersLeft-1, likelyhoods)
    # No return val, instead this function edits likelyhoods.

def colorsOf(guilds):
    set = [guilds[0][0], guilds[0][1]]
    # For the remaining guilds:
    for guild in guilds[1:]:
        for char in guild:
            if char not in set:
                set.append(char)
    return set

def odds(likelyhoods):
    total = 0.0
    for l in likelyhoods:
        total += l

    return [l/total for l in likelyhoods]


print('colors:      0    1    2    3    4    5')
for pCount in range(1, 9):
    print(str(pCount) + ' players: ' + str(odds(likelyhoods(pCount))))
