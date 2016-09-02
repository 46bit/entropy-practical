from cp_randomness.exercise1 import LCG, LCGS

def find_cycle_length(lcg):
    # Hint: you want to count how long until the first output comes up again.
    first_output = lcg.next()
    # You can get subsequent outputs the same way.
    #second_output = lcg.next()

    cycle_length = 1
    # @TODO: Calculate the cycle length and return it as an integer.
    return cycle_length

if __name__ == "__main__":
    for lcg_name in ["A", "B", "C", "D"]:
        lcg = LCGS[lcg_name]
        print("LCG %s\n  %s\n  cycle_length=%d" % (lcg_name, lcg.param, find_cycle_length(lcg)))
