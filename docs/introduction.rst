.. _ref_introduction:

============
Introduction
============

Computer systems often need to produce random behaviour. Computer game enemies might need to
walk in unpredictable directions; cryptosystems need extremely unpredictable values for
their keys. As such some uses only need to not be immediately obvious what will happen next,
while others need to be cryptographically hard to attack if our systems are to be secure.

[@TODO: http://crypto.stackexchange.com/questions/12436/what-is-the-difference-between-csprng-and-prng
first comment contains a useful way of explaining PRNG internal state.]

Computers are designed to be regular, determistic machines. As such they don't immediately
suit generating unpredictable random numbers. Researchers have devised many algorithms to
take a starting number (known as a seed) and generate a sequence of numbers that seem random.
These algorithms are called Pseudo-Random Number Generators (PRNGs).

So what do we want from such an algorithm? What are the properties of a random sequence? The
key property is that each output number appears independent of all the other output numbers.

Consider the sequence 2, 3, 5, 7, …. Anyone aware of prime numbers would guess the next number
in the sequence to be 11. As such a list of prime numbers would make a really bad random sequence,
even though the overall pattern of random numbers is somewhat random [@TODO: link to distribution
of random numbers?].

Each output must, regardless of the method of analysis, be uncorrelated with all other outputs. With
care we can obtain sequences like this from quantum fluctuations, radio noise, lava lamps, unstable
electronic circuits and many other sources. However most of these don't fit into a computer or are
hard to extract sufficient numbers from.

.. image:: _images/prng.svg

Thus the need for PRNGs. You seed them with a "true" random number and they produce a sequence of
numbers that appear uncorrelated. However, the design of the algorithm is important. Many generators
do show patterns in their output.

Value plots:

.. raw:: html

   <canvas class="numbers-noise-plot" id="numbers-noise-naturals" width="200" height="200" data-plot-name="Natural numbers" data-numbers-path="_static/numbers/65536-naturals.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-primes" width="200" height="200" data-plot-name="Prime numbers" data-numbers-path="_static/numbers/65536-primes.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-lcg" width="200" height="200" data-plot-name="LCG" data-numbers-path="_static/numbers/65536-lcg.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-lcg-prime" width="200" height="200" data-plot-name="LCG with Prime params" data-numbers-path="_static/numbers/65536-lcg-prime.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-python-random-mersenne" width="200" height="200" data-plot-name="Python random (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-mersenne.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-python-systemrandom" width="200" height="200" data-plot-name="/dev/urandom (Mac, Yarrow)" data-numbers-path="_static/numbers/65536-python-systemrandom.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-python-random-multiseed" width="200" height="200" data-plot-name="Python multiseed 0th output (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-multiseed.txt"></canvas>

Coordinate plots (x, y) = (output i, output i+1):

.. raw:: html

   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-naturals" width="200" height="200" data-plot-name="Natural numbers" data-numbers-path="_static/numbers/65536-naturals.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-primes" width="200" height="200" data-plot-name="Prime numbers" data-numbers-path="_static/numbers/65536-primes.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-lcg" width="200" height="200" data-plot-name="LCG" data-numbers-path="_static/numbers/65536-lcg.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-lcg-prime" width="200" height="200" data-plot-name="LCG with Prime params" data-numbers-path="_static/numbers/65536-lcg-prime.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-randu" width="200" height="200" data-plot-name="RANDU" data-numbers-path="_static/numbers/65536-randu.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-python-random-mersenne" width="200" height="200" data-plot-name="Python random (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-mersenne.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-python-systemrandom" width="200" height="200" data-plot-name="/dev/urandom (Mac, Yarrow)" data-numbers-path="_static/numbers/65536-python-systemrandom.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-python-random-multiseed" width="200" height="200" data-plot-name="Python multiseed 0th output (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-multiseed.txt"></canvas>

3D phase space (delayed coordinate) plots:

.. raw:: html

   <!--<div class="numbers-phase-space-plot" id="numbers-phase-space-naturals" style="width: 400px; height: 200px;" data-plot-name="Natural numbers" data-numbers-path="_static/numbers/65536-naturals.txt"></div>
   <div class="numbers-phase-space-plot" id="numbers-phase-space-primes" style="width: 400px; height: 200px;" data-plot-name="Prime numbers" data-numbers-path="_static/numbers/65536-primes.txt"></div>
   <div class="numbers-phase-space-plot" id="numbers-phase-space-lcg" style="width: 400px; height: 200px;" data-plot-name="LCG" data-numbers-path="_static/numbers/65536-lcg.txt"></div>
   <div class="numbers-phase-space-plot" id="numbers-phase-space-lcg-prime" style="width: 400px; height: 200px;" data-plot-name="LCG with Prime params" data-numbers-path="_static/numbers/65536-lcg-prime.txt"></div>
   <div class="numbers-phase-space-plot" id="numbers-phase-space-python-random-mersenne" style="width: 400px; height: 200px;" data-plot-name="Python random (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-mersenne.txt"></div>
   <div class="numbers-phase-space-plot" id="numbers-phase-space-python-systemrandom" style="width: 400px; height: 200px;" data-plot-name="/dev/urandom (Mac, Yarrow)" data-numbers-path="_static/numbers/65536-python-systemrandom.txt"></div>
   <div class="numbers-phase-space-plot" id="numbers-phase-space-python-random-multiseed" style="width: 400px; height: 200px;" data-plot-name="Python multiseed 0th output (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-multiseed.txt"></div>-->

Coordinate plots (x, y, z) = (output i, output i+1, output i+2):

.. raw:: html

   <!--<div class="numbers-xyz-plot" id="numbers-xyz-naturals" style="width: 400px; height: 200px;" data-plot-name="Natural numbers" data-numbers-path="_static/numbers/65536-naturals.txt"></div>
   <div class="numbers-xyz-plot" id="numbers-xyz-primes" style="width: 400px; height: 200px;" data-plot-name="Prime numbers" data-numbers-path="_static/numbers/65536-primes.txt"></div>
   <div class="numbers-xyz-plot" id="numbers-xyz-lcg" style="width: 400px; height: 200px;" data-plot-name="LCG" data-numbers-path="_static/numbers/65536-lcg.txt"></div>
   <div class="numbers-xyz-plot" id="numbers-xyz-lcg-prime" style="width: 400px; height: 200px;" data-plot-name="LCG with Prime params" data-numbers-path="_static/numbers/65536-lcg-prime.txt"></div>
   <div class="numbers-xyz-plot" id="numbers-xyz-python-random-mersenne" style="width: 400px; height: 200px;" data-plot-name="Python random (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-mersenne.txt"></div>
   <div class="numbers-xyz-plot" id="numbers-xyz-python-systemrandom" style="width: 400px; height: 200px;" data-plot-name="/dev/urandom (Mac, Yarrow)" data-numbers-path="_static/numbers/65536-python-systemrandom.txt"></div>
   <div class="numbers-xyz-plot" id="numbers-xyz-python-random-multiseed" style="width: 400px; height: 200px;" data-plot-name="Python multiseed 0th output (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-multiseed.txt"></div>-->
   <div class="numbers-xyz-plot" id="numbers-xyz-python-random-multiseed" style="width: 400px; height: 400px;" data-plot-name="RANDU" data-numbers-path="_static/numbers/65536-randu.txt"></div>

[@TODO: Output visualisations for several PRNGs. Noise clouds. Phase Space analysis. d3 or ThreeJS?]

It is important to remember that PRNG outputs are related. The algorithm's internal state is
generating each number, and while the output routine might obfuscate the relation it still did arise
from this process.

.. _ref_objectives:

___________________
Aims and Objectives
___________________

The objective of this experiment is to:

* Understand that random number generation is important in many contexts.
* Show it is possible to attack security systems using non-cryptographically-secure
  PRNGs.
* Show that it is possible to attack systems using CSPRNGs if it is used in an insecure manner,
  e.g. poor Seeding.
* Investigate patterns in random number generation output.

.. _ref_prerequisites:

_____________________________________
Prerequisites, Equipment and Software
_____________________________________

This experiment requires the ability to write small programs in Python. You will also
need to make basic use of the Linux command line to run your program and the Usemin
file monitor to manage and edit files.  (see Virtual Machine documentation).

.. _ref_ethics:

______________
Ethical Issues
______________

There are no specific ethical issues in conducting the experiment.

As is common in security teaching, the techniques described here could be used to
attack systems but you must behave responsibly and ethically toward other people,
their data and systems. The writing or use of tools to gain unauthorised access
to systems is a criminal offence.

