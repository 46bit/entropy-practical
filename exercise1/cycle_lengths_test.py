# python -m unittest cycle_lengths_test
# or
# python cycle_lengths_test.py

import sys, unittest, bcrypt
from cp_randomness.exercise1 import LCG, LCGS

# For new Python:
#from pathlib import Path
#root = Path(__file__).resolve().parents[0].path
# For older Python:
from os.path import dirname, abspath
root = dirname(abspath(__file__))
sys.path.append(root)
from cycle_lengths import find_cycle_length

class LCGCycleLengthTest(unittest.TestCase):
    # Bruteforcing for the correct cycle lengths is going to take a while. Each guess will
    # take you >1s on a typical CPU, and the values range into the tens of thousands.
    # Given that, you're probably better off asking for help instead. ;-)
    def bcrypt_cmp(self, expectation, cycle_length):
        bcrypted_cycle_length = bcrypt.hashpw(str(cycle_length).encode('utf-8'), expectation.encode('utf-8')).decode()
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
