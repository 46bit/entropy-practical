import random

for i in range(0, 65536):
  # a <= N <= b
  print random.randint(0, (1<<31)-1)
