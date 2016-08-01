import math

prime = 2
for i in range(0, 65536):
  print prime
  while True:
    prime += 1
    is_prime = True
    for j in range(2, int(math.ceil(math.sqrt(prime))) + 1):
      if prime % j == 0:
        is_prime = False
        break
    if is_prime:
      break
