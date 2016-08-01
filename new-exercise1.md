In this exercise we're going to learn more about random numbers.

[ 20 plots of some LCGs. mainly if not all LCGs. number them. ]

Which of these *look* random to you? [Point out some that do and do not? Maybe.]

Issue of cycle length. 0, 1, ..., 2^m sequence vs 0, 5, ..., ~2^m sequence, as example.
Similarly with PRNGs, some will cover the entire range of possible output values before cycling.
[Contrast the output of an LCG a used LCG generating 0, 1, 0, 1, ... with a better one?]

Your task is to write a routine to calculate the cycle length of a sequence. You might find the first
output is not repeated, but rather the Nth output will be repeated after N+cycle_length steps. Thus you
want to record every observed number and count how long it is until you first see a number again.

[Show them how to do it. Howard's rough code is a good approach, KISS.]

[Testcases or something to check it's correct.]

Drawbacks. [At some point I need to introduce LCGs. Probably above.]
Consider the sequence 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, .... The sequence will clearly be maximal,
and yet the trailing digit repeats far sooner than that. 0, ..., 9 will be encountered every 10 steps.
Similarly with LCGs, sequences of maximal cycle length can have similar drawbacks.

[RANDU's never generating even ints?]

Write a program to calculate the cycle length for low-order bits.

Consider the sequence:
  0x9282    2  10
  0x3aae    e  10
  0x5e80    0  00
  0x9c3e    e  10
  0x13f6    6  00
  0x320a    a  10
  0xa082    2  10
  0x64ca    a  10
  0xf928    8  00
  0x1570    0  00
  0xb07a    a  10
  0x8cd2    2  10
  0x7992    2  10
  0xffaa    a  10
  0xab02    2  10
  0x460     0  00
  0x6d28    8  00
  0x7054    4
  0xa5de    e
  0xd0e8    8

[@TODO: Figure out where LCGs go. Consider how little theory to discuss.]

LCG intro:

A simple-to-introduce PRNG known as the Linear Congruential Generator was once commonly used for
non-cryptographic applications. It works like thus:

X_(n+1) = a.X_n +
x
