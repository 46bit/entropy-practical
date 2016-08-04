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

for modulus in range(0xffff + 1, 0, -1):
    for multiplier in range(modulus / 20, modulus, 1):
        lcg_param = LcgParamTuple(multiplier, modulus, 0)
        lcg = LCG(lcg_param)
        lcg.setseed(0x7532)
        length = cycle_length(lcg)
        if length >= math.sqrt(lcg_param.modulus):
            print "cargo run %d %d %d # cycle_length=%d" % (lcg_param.multiplier, lcg_param.modulus, lcg_param.increment, length)
            #print "length=%d lcg_param=%s" % (length, lcg_param)
