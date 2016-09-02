from cp_randomness.exercise1 import LCG, LCGS

# Implement find_low_bits_cycle using the hints it contains.
# To run this file and see your calculated cycle lengths, run
#   python3 low_order_cycle_lengths.py
# To check your results, run the tests
#   python3 low_order_cycle_lengths_test.py

def find_low_bits_cycle(low_bit_count, lcg):
    mask = (1 << low_bit_count) - 1

    # Get the low bits of an LCG output like this:
    first_output = lcg.next()
    first_output_low_bits = first_output & mask

    # Try cycle lengths from 0 to the maximum possible cycle length.
    lob_cycle_length = None
    for offset in range(1, lcg.param.modulus + 1):
        # Make a copy of the original LCG.
        unoffset_lcg = LCG(lcg.param, seed=first_output)

        # This is how to make a new LCG setup the same as ours and then advance it by `offset'.
        # If the cycle length was 1, these two generators would have identical outputs forever.
        # Find the right amount to advance to have the outputs match that of the original generator.
        offset_lcg = LCG(lcg.param, seed=first_output).advance(offset)

        # Check the outputs match up until the maximum overall cycle length.
        matches = True
        for j in range(1, lcg.param.modulus + 1):
            # @TODO: By student.
            pass

        if matches:
            lob_cycle_length = offset
            break

    # Calculate the cycle length of the low order bits and return it as an integer.
    return lob_cycle_length

if __name__ == "__main__":
    for lcg_name in ["A", "B", "C"]:
        lcg = LCGS[lcg_name]
        print("LCG %s\n  %s" % (lcg_name, lcg.param))
        for low_bit_count in range(1, 12):
            low_bit_cycle_length = find_low_bits_cycle(low_bit_count, lcg)
            print("  low_%dbits_cycle_length = %d" % (low_bit_count, low_bit_cycle_length))
