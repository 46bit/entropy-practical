# @TODO: Put the following in a separate package.
import math
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
def find_cycle_length(lcg):
    first_output = lcg.next()
    cycle_length = 0
    while True:
        cycle_length += 1
        new_output = lcg.next()
        if first_output == new_output:
            break
    return cycle_length

# SKELETON FOR STUDENT
# def find_cycle_length(lcg):
#     # @TODO: Put your code here.
#     # Hint: you want to count how long until output 1 comes up again.
#     return cycle_length

for lcg_name in ["A", "B", "C", "D", "E", "F", "G", "H"]:
    lcg = LCGS[lcg_name]
    print("LCG %s\n  %s\n  cycle_length=%d" % (lcg_name, lcg.param, find_cycle_length(lcg)))

# @TODO: Move to separate file before giving to student.
import unittest, bcrypt

class LCGCycleLengthTest(unittest.TestCase):
    # Bruteforcing for the correct cycle lengths is going to take a while. Each guess will
    # take you >1s on a typical CPU, and the values range into the tens of thousands.
    # Given that, you're probably better off asking for help instead. ;-)
    def bcrypt_cmp(self, expectation, cycle_length):
        bcrypted_cycle_length = bcrypt.hashpw(str(cycle_length), expectation)
        self.assertEqual(expectation, bcrypted_cycle_length)

    def test_a(self):
        expectation = "$2b$14$6kv3i0cEBc7oSOXIdrsjquc66kOZM7.6XM6aINT7Hp0kk2fmq1TZ2"
        cycle_length = find_cycle_length(LCGS["A"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_b(self):
        expectation = "$2b$14$AYdQToXcR8oJTZw7DZvgGO9jU72HVsSlsuHljI89wUec46mR37lV2"
        cycle_length = find_cycle_length(LCGS["B"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_c(self):
        expectation = "$2b$14$H4sH1OjafANOmPdODmCGj.enbZPb8Yezfs3n13rn1k7iK0/cKblB6"
        cycle_length = find_cycle_length(LCGS["C"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_d(self):
        expectation = "$2b$14$yDDSQglGxtYSE4wUQV094u7ewL.O48Qpy4SyCKDUwEYCabMrMQXBG"
        cycle_length = find_cycle_length(LCGS["D"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_e(self):
        expectation = "$2b$14$wrB9bnwIlK21LVeDToiuq.I8nU4XHhp4kDTAmE5pZtmQyfZ2hvVSC"
        cycle_length = find_cycle_length(LCGS["E"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_f(self):
        expectation = "$2b$14$998iGLzdoWhAiqgJgxqGK.w3raYScYgaHALtuvhvtdsKv6A7mMP.K"
        cycle_length = find_cycle_length(LCGS["F"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_g(self):
        expectation = "$2b$14$buoqYdqykxUlC3yYVOdk1.m3EM3bgg4Qihyyg0m0.ZSaACiOhAeca"
        cycle_length = find_cycle_length(LCGS["G"])
        self.bcrypt_cmp(expectation, cycle_length)

    def test_h(self):
        expectation = "$2b$14$x/v4ZI4/wpvefetwp.PtmuLr//.SMXHOCzl0.Er9B6jhDQgj7azky"
        cycle_length = find_cycle_length(LCGS["H"])
        self.bcrypt_cmp(expectation, cycle_length)

unittest.main()
