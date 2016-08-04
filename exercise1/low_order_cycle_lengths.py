from randompy.exercise1 import LCG, LCGS

# Implement find_low_bits_cycle using the hints it contains.
# To run this file and see your calculated cycle lengths, run
#   python3 low_order_cycle_lengths.py
# To check your results, run the tests
#   python3 low_order_cycle_lengths_test.py

def find_low_bits_cycle(low_bit_count, lcg):
    mask = (1 << low_bit_count) - 1
    # Hint: you can get an output and its low bits like this:
    first_output = lcg.next()
    first_output_low_bits = first_output & mask

    # Hint: for each possible cycle length, you need to seed a new LCG with the output that would start
    # the new cycle. Then go up to lcg.param.modulus, to be sure you have a real cycle.
    second_output = lcg.next()
    new_lcg = LCG(lcg.param)
    lcg_from_output = LCG(lcg.param).seed(second_output)
    for i in range(0, lcg.param.modulus):
        if new_lcg.next() & mask != lcg_from_output.next() & mask:
            # This isn't a low-order-bit cycle.

    # Calculate the cycle length of the low order bits and return it as an integer.
    return lob_cycle_length

if __name__ == "__main__":
    for lcg_name in ["A", "B", "C", "D", "E", "F", "G", "H"]:
        lcg = LCGS[lcg_name]
        print("LCG %s\n  %s" % (lcg_name, lcg.param))
        for low_bit_count in range(1, 17):
            low_bit_cycle_length = find_low_bits_cycle(low_bit_count, lcg)
            print("  low_%dbits_cycle_length = %d" % (low_bit_count, low_bit_cycle_length))
