import math, sys
from collections import namedtuple

LcgParamTuple = namedtuple('Params', 'multiplier modulus increment')

class LCG():
    def __init__(self, lcg_param, seed=1):
        self.param = lcg_param
        self.seed = seed
        # Seeding.
        self.state = seed % self.param.modulus

    def next(self):
        self.state = (self.param.multiplier * self.state + self.param.increment) % self.param.modulus
        return self.state

    def advance(self, offset):
        for i in range(0, offset):
            self.next()
        return self

# LCG_PARAMS is a list of parameters for Linear Congruential Generators, matching up with those on
# Exercise 1's documentation.
# N.B. To keep cycle calculation very simple, all parameters are chosen to have no run-in. That is,
# the first outputted value is included in each cycle.
LCG_PARAMS = {
    "A": LcgParamTuple(259, 65534, 0),
    "B": LcgParamTuple(361, 450, 1),
    "C": LcgParamTuple(85, 65536, 1),
    "D": LcgParamTuple(29305, 58564, 1)
}

LCGS = {}
for lcg_name in LCG_PARAMS:
    lcg_param = LCG_PARAMS[lcg_name]
    LCGS[lcg_name] = LCG(lcg_param)
