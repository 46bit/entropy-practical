import random

system_random = random.SystemRandom()
for i in range(0, 65536):
  # a <= N <= b
  print system_random.randint(0, (1<<31)-1)
