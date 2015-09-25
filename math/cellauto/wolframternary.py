#!/usr/bin/python

import sys

# for now, just a simple ternary charset

ROWS = 1000

charset = { 
	'0': ' ', 
	'1': '-', 
	'2': '=' 
}

# assume len 3
def summodulo(substring):
	# print('[' + substring + ']')
	sum_int = int(substring[0]) + int(substring[1]) + int(substring[2])
	return str(sum_int % len(charset))

def successor(prevrow):
	nextrow = list('0' * len(prevrow))
	for i in range(len(prevrow)):
		if i-1 < 0:
			# substr = prevrow[i : i+2]
			# appended_str = '0' + substr
			# summed = summodulo(appended_str)
			# nextrow[i] = summed
			nextrow[i] = summodulo('0' + prevrow[i : i+2])
		elif i+1 > len(prevrow)-1:
			nextrow[i] = summodulo(prevrow[i-1 : i+1] + '0')
		else:
			# print(prevrow[i-1 : i+2] + ' is prevrow slice ')
			nextrow[i] = summodulo(prevrow[i-1 : i+2])

	return ''.join(nextrow)

def gen(firstrow):
	prevrow = firstrow
	output = firstrow
	for rowi in range(ROWS):
		nextrow = successor(prevrow)
		output = output + nextrow + '\n'
		prevrow = nextrow
		# print('finished line, it is: ' + nextrow)
	return output

def printpattern(pattern):
	for key in charset:
		pattern = pattern.replace(key, charset[key])
	print(pattern)

if len(sys.argv) < 2:
	printpattern(gen('011001200121'))
	# printpattern(gen('010021021200120010100212001200101011022022221111020120102100212001200101011022022221111020120102100212001200101011022022221111020120102101102202222111102012010210210'))
else:
	printpattern(gen(sys.argv[1]))

