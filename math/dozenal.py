# dozenal

def digitstr(val):
  if val <= 9:
    return str(val)
  else:
    # A == ten, B == eleven, etc
    return chr(val + 55)

def tobase(n, base):
  # Im not going to deal with negatives and
  # floats for this exercise
  if not n >= 0: return 'negative_error'
  if not int(n) == n: return 'nonint_error'
  if not base > 1: return 'base_error'

  # Init degree to highest contained in n
  degree = 0
  while base**(degree+1) <= n:
    degree += 1

  digits = [0 for i in range(degree+1)]

  while n > 0:
    multiples = n // base**degree
    digits[degree] = multiples
    n -= multiples * base**degree
    degree -= 1
  
  representation = ''.join(map(digitstr, reversed(digits)))

  if (len(representation) >= 2 and
      representation[-1] == '0' and
      representation[-2] == '0'):
    return representation + ' <- century rollover'
  else:
    return representation

def todozenal(n):
  return tobase(n, 12)

def bases_up_to(n, maxbase):
  return [tobase(n,b) for b in range(2, maxbase+1)]

first_z_base = 36

def yearsummary(n):
  return '\n'.join(bases_up_to(n, first_z_base))

# Or is 'divisors' the more usual term?
# todo General version: GCD with constraint that must be squareful
# That would catch cubes too right? 
def max_square_multiple(n):
  max_multiple = 1
  multiple_root = 2
  multiple = multiple_root**2
  while multiple < (n/2):
    if n % multiple == 0:
      max_multiple = multiple

    multiple_root += 1
    multiple = multiple_root**2

  return max_multiple

def as_multiples(n):
  multiple = max_square_multiple(n)
  return '{total} is {count} {mult}s'.format(total=n, count=n/multiple, mult=multiple)

print('\n'.join([as_multiples(n) for n in range(1989, 2021)]))

# print('\n'.join([yearsummary(year) for year in range(2021, 2031)]))

# print('')
# print(tobase(2022, 17))
# print(tobase(2023, 17))
# print('')
# print(tobase(2024, 15))
# print(tobase(2025, 15))
# print('')
# print(tobase(2027, 26))
# print(tobase(2028, 26))
