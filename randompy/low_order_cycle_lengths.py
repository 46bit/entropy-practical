# @TODO: Put the following in a separate package.
import math, sys
from collections import namedtuple

LcgParamTuple = namedtuple('Params', 'multiplier modulus increment')

class LCG():
    def __init__(self, lcg_param):
        self.param = lcg_param
        self.setseed(1)

    def setseed(self, value):
        self.state = value % self.param.modulus
        return self

    def next(self):
        self.state = (self.param.multiplier * self.state + self.param.increment) % self.param.modulus
        return self.state

# LCG_PARAMS is a list of parameters for Linear Congruential Generators, matching up with those on
# Exercise 1's documentation.
# N.B. To keep cycle calculation very simple, all parameters are chosen to have no run-in. That is,
# the first outputted value is included in each cycle.
LCG_PARAMS = {
    "A": LcgParamTuple(65473, 65536, 0),
    "B": LcgParamTuple(259, 65534, 0),
    "C": LcgParamTuple(9562, 65522, 0),
    "D": LcgParamTuple(1001, 2187, 8),
    "E": LcgParamTuple(361, 450, 1),
    "F": LcgParamTuple(71, 125, 1),
    "G": LcgParamTuple(85, 65536, 1),
    "H": LcgParamTuple(29305, 58564, 1)
}

LCGS = {}
for lcg_name in LCG_PARAMS:
    lcg_param = LCG_PARAMS[lcg_name]
    LCGS[lcg_name] = LCG(lcg_param)

# @TODO: Use the following (including a hollowed out cycle_length) as the file a student will edit.
#import LCGS from PrngExercise

# DEMO SOLUTION
# N.B. No need to handle run in; LCG parameters are picked to avoid it for simplicity.
# @TODO: Remove before giving this to a student.
def find_low_bits_cycle(low_bit_count, lcg, run_in=0):
    mask = (1 << low_bit_count) - 1
    #mask = 1 << (low_bit_count - 1)
    lob_cycle_length = 1
    explained = False
    first_output = lcg.next()
    first_output_lob = first_output & mask
    while not explained and lob_cycle_length < lcg.param.modulus:
        new_output = lcg.next()
        new_output_lob = new_output & mask
        if new_output_lob == first_output_lob:
            g1 = LCG(lcg.param).setseed(first_output)
            g2 = LCG(lcg.param).setseed(new_output)
            explained = True
            for i in range(0, lcg.param.modulus):
                if g1.next() & mask != g2.next() & mask:
                    explained = False
                    break
        if not explained:
            lob_cycle_length += 1
    return lob_cycle_length

# SKELETON FOR STUDENT
#def find_low_bits_cycle(low_bit_count, lcg, run_in=0):
#    return lob_cycle_length

for lcg_name in ["A", "B", "C", "D", "E", "F", "G", "H"]:
    lcg = LCGS[lcg_name]
    print("LCG %s\n  %s" % (lcg_name, lcg.param))
    for low_bit_count in range(1, 17):
        low_bit_cycle_length = find_low_bits_cycle(low_bit_count, lcg)
        print("  low_%dbits_cycle_length = %d" % (low_bit_count, low_bit_cycle_length))

# @TODO: Move to separate file before giving to student.
import unittest, bcrypt

class LCGLowBitCycleLengthTest(unittest.TestCase):
    # Bruteforcing for the correct cycle lengths is going to take a while. Each guess will
    # take you >1s on a typical CPU, and the values range into the tens of thousands.
    # Given that, you're probably better off asking for help instead. ;-)
    def bcrypt_cmp(self, expectation, cycle_lengths):
        cycle_lengths_str = ",".join(map(str, cycle_lengths))
        bcrypted_cycle_length = bcrypt.hashpw(cycle_lengths_str, expectation)
        self.assertEqual(expectation, bcrypted_cycle_length)

    def assemble_0to16_low_bit_cycle_lengths(self, lcg):
        low_bit_cycle_lengths = []
        for low_bit_count in range(1, 17):
            # Underscores to indicate ongoing test activity to student.
            sys.stderr.write("_")
            sys.stderr.flush()
            low_bit_cycle_length = find_low_bits_cycle(low_bit_count, lcg)
            low_bit_cycle_lengths.append(low_bit_cycle_length)
        return low_bit_cycle_lengths

    def test_a(self):
        expectation = "$2b$14$i9/rhzwNqe1Z643jpdG7teRu/Pf.mgrKhwXTmakT9XsnR9m9FSTD2"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["A"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_b(self):
        expectation = "$2b$14$Le75XYznZzF2Cv3EwwPSm.OMoB1WwfmPllX.Drwa4.fQYaXh6xMIi"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["B"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_c(self):
        expectation = "$2b$14$stzo8T1jm.gAra/6zicdYuwL/xXJ.nD.sNimK85qAGRR/0aY.DIj6"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["C"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_d(self):
        expectation = "$2b$14$vhd1utaPoAgsbq9ogy7imejDDKqBHUZJrLKladoom/GTlpHvYmW96"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["D"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_e(self):
        expectation = "$2b$14$ASJ1Rco2ISyROFUghQHyueGx.38Bj42ZpSC01vTAEidkaPa6CM/X."
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["E"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_f(self):
        expectation = "$2b$14$QkgQG/plfHAxsvH.KRI3IeEWUE6oxd0ld6RzjDoTrwkKN4QVumWOy"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["F"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_g(self):
        expectation = "$2b$14$7iZo1JPj.VUkmW8alzXeTuNMDeCFPiLZuLjtA1S1PnUEC8USgDWgS"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["G"])
        self.bcrypt_cmp(expectation, cycle_lengths)

    def test_h(self):
        expectation = "$2b$14$1Dfkh6259abwtbw6eO2mhOPVyzH/590sTtRmEkJvBSqqaenoEn38a"
        cycle_lengths = self.assemble_0to16_low_bit_cycle_lengths(LCGS["H"])
        self.bcrypt_cmp(expectation, cycle_lengths)

unittest.main()
