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

def bit_cycle_lengths(lcg, bitmask):
    output_indexes = {}
    i = 0
    while True:
        output = lcg.next() & bitmask
        if output in output_indexes:
            return i - output_indexes[output]
        output_indexes[output] = i
        i += 1

lcg0101 = LCG(LCG_PARAMS[0])
lcg0101.setseed(0)
print("lcg0101")
for i in range(0, 20):
    print("  0x%x" % lcg0101.next())
print("  cycle_length=%d" % cycle_length(lcg0101))

lcgNotCoprimeShort = LCG(LCG_PARAMS[1])
lcgNotCoprimeShort.setseed(0x7575)
print("lcgNotCoprimeShort (seed not coprime either, short period)")
for i in range(0, 20):
    print("  0x%x" % lcgNotCoprimeShort.next())
print("  cycle_length=%d" % cycle_length(lcgNotCoprimeShort))

lcgNotCoprime = LCG(LCG_PARAMS[1])
lcgNotCoprime.setseed(0x7532)
print("lcgNotCoprime")
for i in range(0, 20):
    print("  0x%x" % lcgNotCoprime.next())
print("  cycle_length=%d" % cycle_length(lcgNotCoprime))

lcgRandu16bit = LCG(LCG_PARAMS[2])
lcgRandu16bit.setseed(0x7532)
print("lcgRandu16bit")
for i in range(0, 20):
    print("  0x%x" % lcgRandu16bit.next())
print("  cycle_length=%d" % cycle_length(lcgRandu16bit))

lcgModModuloMultIsZero = LCG(LCG_PARAMS[3])
lcgModModuloMultIsZero.setseed(0x7532)
print("lcgModModuloMultIsZero")
for i in range(0, 20):
    print("  0x%x" % lcgModModuloMultIsZero.next())
print("  cycle_length=%d" % cycle_length(lcgModModuloMultIsZero))
