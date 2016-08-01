import math
from collections import namedtuple

LcgParamTuple = namedtuple('Params', 'multiplier modulus increment')

# LCG_PARAMS is a list of available conguential generators (multiplier, modulus)
# - does not use the third parameter
# keep them small enough to allow students to test a complete cycle

LCG_PARAMS = (
    LcgParamTuple(0xfe, 0xff, 1), # outputs 0101
    LcgParamTuple(555, 0xffff, 0), # multiplier and modulus not coprime
    LcgParamTuple(259, 0xfffe, 0), # Randu 16-bit (http://www.cs.wustl.edu/~jain/cse567-08/ftp/k_26rng.pdf)
    LcgParamTuple(13107, 0xffff, 0) # modulus % multiplier == 0
)

class LCG():
    def __init__(self, lcg_param):
        self.multiplier = lcg_param.multiplier
        self.modulus    = lcg_param.modulus
        self.increment  = lcg_param.increment
        self.setseed(1)

    def setseed(self, value):
        self.state = value % self.modulus

    def next(self):
        self.state = (self.state * self.multiplier + self.increment) % self.modulus
        return self.state

def cycle_length(lcg):
    output_indexes = {}
    i = 0
    while True:
        output = lcg.next()
        if output in output_indexes:
            return i - output_indexes[output]
        output_indexes[output] = i
        i += 1

def ac(a, b):
  return (a - 0.5)*(b - 0.5)/0.25

def bitmask_autocorrelate_sum(lcg, low_bits_to_use, outputs_to_use=65536):
    bitmask = (2**low_bits_to_use) - 1
    previous_output = lcg.next() & bitmask
    ac_sum = 0
    for i in range(0, outputs_to_use):
        output = lcg.next() & bitmask
        ac = (output - bitmask/2.0) * (previous_output - bitmask/2.0) / (bitmask/4.0)
        ac_sum += ac
        previous_output = output
    return ac_sum

def bit_cycle_lengths(lcg, low_bits_to_use, outputs_to_use=65536):
    bitmask = (2**low_bits_to_use) - 1
    cycle = []
    possible_cycle_detected = False
    post_possible_cycle_discovery = []
    i = 0
    for j in range(0, outputs_to_use):
        output = lcg.next() & bitmask
        output = output & bitmask
        if not possible_cycle_detected:
            if len(cycle) > 0 and output == cycle[0]:
                # possible cycle
                possible_cycle_detected = True
                post_possible_cycle_discovery.append(output)
                i = 1
            else:
                # not possible cycle
                cycle.append(output)
        else:
            if cycle[i % len(cycle)] == output:
                # matches cycle
                post_possible_cycle_discovery.append(output)
                i += 1
            else:
                # doesn't match cycle
                cycle += post_possible_cycle_discovery
                possible_cycle_detected = False
                i = 0
    return cycle


def rwh_primes1(n):
    # http://stackoverflow.com/questions/2068372/fastest-way-to-list-all-primes-below-n-in-python/3035188#3035188
    """ Returns  a list of primes < n """
    sieve = [True] * (n/2)
    for i in xrange(3,int(n**0.5)+1,2):
        if sieve[i/2]:
            sieve[i*i/2::i] = [False] * ((n-i*i-1)/(2*i)+1)
    return [2] + [2*i+1 for i in xrange(1,n/2) if sieve[i]]

def prime_factors_of_n(n, primes_up_to_n):
    prime_factors = []
    while n > 1:
        for p in primes_up_to_n:
            if n % p == 0:
                n = n / p
                prime_factors.append(p)
                break
    return prime_factors

max_m = 0xffff + 1
primes_below_max_m = rwh_primes1(max_m)

for modulus in range(2, max_m + 1, 1):
    prime_factorisation_of_m = prime_factors_of_n(modulus, primes_below_max_m)
    unique_primes_in_factorisation_of_m = set(prime_factorisation_of_m)
    lcm = reduce(lambda x, y: x*y, unique_primes_in_factorisation_of_m)
    #print modulus, prime_factorisation_of_m, unique_primes_in_factorisation_of_m, lcm
    for i in range(1, modulus / lcm + 1):
        ilcm = lcm * i

        if modulus % 4 == 0 and ilcm % 4 != 0:
            continue
        multiplier = ilcm + 1

        lcg_param = LcgParamTuple(multiplier, modulus, 1)
        lcg = LCG(lcg_param)
        lcg.setseed(0x7532)
        length = cycle_length(lcg)
        #if length >= math.sqrt(lcg_param.modulus):
        #print "length=%d bit0_length=%d bit10_length=%d bit210_length=%d lcg_param=%s" % (length, bitmask_autocorrelate_sum(lcg, 1), bitmask_autocorrelate_sum(lcg, 2), bitmask_autocorrelate_sum(lcg, 3), lcg_param)
        print "cargo run %d %d %d # cycle_length=%d" % (lcg_param.multiplier, lcg_param.modulus, lcg_param.increment, length)

