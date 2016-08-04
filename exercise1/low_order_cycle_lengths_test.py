# python3 -m unittest low_order_cycle_lengths_test
# or
# python3 low_order_cycle_lengths_test.py

import sys, unittest, bcrypt
from randompy.exercise1 import LCG, LCGS

# For new Python:
#from pathlib import Path
#root = Path(__file__).resolve().parents[0].path
# For older Python:
from os.path import dirname, abspath
root = dirname(abspath(__file__))
sys.path.append(root)
from low_order_cycle_lengths import find_low_bits_cycle

class LCGLowBitCycleLengthTest(unittest.TestCase):
    # Bruteforcing for the correct cycle lengths is going to take a while. Each guess will
    # take you >1s on a typical CPU, and the values range into the tens of thousands.
    # Given that, you're probably better off asking for help instead. ;-)
    def bcrypt_cmp(self, expectation, cycle_lengths):
        cycle_lengths_str = ",".join(map(str, cycle_lengths))
        bcrypted_cycle_length = bcrypt.hashpw(cycle_lengths_str.encode('utf-8'), expectation.encode('utf-8')).decode()
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
