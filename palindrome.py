
def palindrome(lefthalf):
  rightwithoutcenter = lefthalf[-2::-1]
  return lefthalf + rightwithoutcenter

print(palindrome('NOSIRAWAYAPA'))

# >>> palindrome.palindrome('TORRENTRAPTOR ')
# 'TORRENTRAPTOR ROTPARTNERROT'
