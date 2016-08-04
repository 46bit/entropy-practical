from collections import namedtuple

LcgParamTuple = namedtuple('Params', 'multiplier modulus increment')

# LCG_PARAMS is a list of available conguential generators (multiplier, modulus)
# - does not use the third parameter
# keep them small enough to allow students to test a complete cycle

LCG_PARAMS = (
    LcgParamTuple(2, 10, 3), # outputs 0101
    LcgParamTuple(2, 9, 3), # multiplier and modulus not coprime
    LcgParamTuple(3, 10, 2), # Randu 16-bit (http://www.cs.wustl.edu/~jain/cse567-08/ftp/k_26rng.pdf)
    LcgParamTuple(2, 9, 2), # Randu 16-bit (http://www.cs.wustl.edu/~jain/cse567-08/ftp/k_26rng.pdf)
    LcgParamTuple(3, 9, 2), # Randu 16-bit (http://www.cs.wustl.edu/~jain/cse567-08/ftp/k_26rng.pdf)
    LcgParamTuple(3, 9, 3), # Randu 16-bit (http://www.cs.wustl.edu/~jain/cse567-08/ftp/k_26rng.pdf)
    LcgParamTuple(3, 10, 3) # modulus % multiplier == 0
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

def bit_cycle_lengths(lcg, bitmask):
    output_indexes = {}
    i = 0
    while True:
        output = lcg.next() & bitmask
        if output in output_indexes:
            return i - output_indexes[output]
        output_indexes[output] = i
        i += 1

for i in range(len(LCG_PARAMS)):
    lcg_param = LCG_PARAMS[i]
    lcg = LCG(lcg_param)
    print(lcg_param)
    print("  cycle_length=%d" % cycle_length(lcg))
    for j in range(0, 20):
        print("  0x%x" % lcg.next())
