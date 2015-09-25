#!/usr/bin/python

# scrum circle: pass baton to someone who has not yet gone and who is not next to you
# assume frank always starts
# how many possible paths are there? 

# count = 0
circle = []

def pathCount(pop):
    # eg ['A', 'B', 'C', 'D', 'E']
    circle = [chr(65 + i) for i in range(pop)]  
    count = helper([circle[0]], circle)
    print(count)
    return count

def helper(partialPath, circle):
    # print('debug: circle is ' + str(circle))
    # print('debug: partialPath is ' + str(partialPath))
    canPassBaton = False # assume
    futuresSum = 0
    for char in circle:
        # print('degbug: curchar is ' + char)
        if char in partialPath:
            continue
        if adjacent(char, partialPath[-1], circle):
            continue
        newPath = partialPath + [char]
        # print('degbug newpath is ' + str(newPath))
        futuresSum += helper(newPath, circle)
        canPassBaton = True

    if canPassBaton:
        # print('in canPassBaton branch')
        # If this partialPath was not a total dead end
        return futuresSum
    else:
        # If this partialPath ends here
        if len(partialPath) == len(circle):
            print(partialPath)
            return 1
        else:
            # path that has no illegal completion
            return 0

def adjacent(char, lastChar, circle):
    lastIndex = -2
    for i, circleChar in enumerate(circle):
        if circleChar == lastChar:
            lastIndex = i
            if i == 0:
                return char == circle[-1] or char == circle[i+1]
            elif i == len(circle)-1:
                return char == circle[i-1] or char == circle[0]
            else:
                return char == circle[i-1] or char == circle[i+1]
    else:
        print('wat! error')


# pathCount(7)  # debug




# prints pascal's triangle up to the given number of rows 
def pascal(rowCount):
    curRow = [1]
    rowi = 0
    while rowi <= rowCount:
        print(str(curRow))
        # todo: save all rows and print whole thing at once with special pretty function 
        newRow = [1]
        for coli, val in enumerate(curRow):
            # we'll append the number below and to the right of 'val'
            if coli == len(curRow)-1:
                # last in row, then just make the rightmost 1
                newRow.append(1)
            else:
                # If not last
                newRow.append(curRow[coli] + curRow[coli+1])
        curRow = newRow
        rowi += 1


# degbug
pascal(40)

