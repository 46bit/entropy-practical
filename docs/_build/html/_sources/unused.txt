
[@TODO: http://crypto.stackexchange.com/questions/12436/what-is-the-difference-between-csprng-and-prng
first comment contains a useful way of explaining PRNG internal state.]

A reasonable quality PRNG should show limited patterns from visualising its output. A good PRNG (and especially CSPRNGs) should show no patterns, at least without in-depth analysis.

Taking outputs and sequentially plotting their intensities on a graph should look like an untuned TV. Here I've plotted a sequence of primes, so as their values increase the chart gets darker.

.. raw:: html

   <canvas class="numbers-noise-plot" id="numbers-noise-lcg" width="200" height="225" data-plot-name="LCG" data-numbers-path="_static/numbers/65536-lcg.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-lcg-prime" width="200" height="225" data-plot-name="LCG with Prime params" data-numbers-path="_static/numbers/65536-lcg-prime.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-randu" width="200" height="225" data-plot-name="RANDU" data-numbers-path="_static/numbers/65536-randu.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-python-random-mersenne" width="200" height="225" data-plot-name="Python random (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-mersenne.txt"></canvas>
   <canvas class="numbers-noise-plot" id="numbers-noise-python-systemrandom" width="200" height="225" data-plot-name="/dev/urandom (Mac, Yarrow)" data-numbers-path="_static/numbers/65536-python-systemrandom.txt"></canvas>

Coordinate plots (x, y) = (output i, output i+1):

.. raw:: html

   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-lcg" width="200" height="225" data-plot-name="LCG" data-numbers-path="_static/numbers/65536-lcg.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-lcg-prime" width="200" height="225" data-plot-name="LCG with Prime params" data-numbers-path="_static/numbers/65536-lcg-prime.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-randu" width="200" height="225" data-plot-name="RANDU" data-numbers-path="_static/numbers/65536-randu.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-python-random-mersenne" width="200" height="225" data-plot-name="Python random (Mersenne)" data-numbers-path="_static/numbers/65536-python-random-mersenne.txt"></canvas>
   <canvas class="numbers-noise-coord-plot" id="numbers-noise-coord-python-systemrandom" width="200" height="225" data-plot-name="/dev/urandom (Mac, Yarrow)" data-numbers-path="_static/numbers/65536-python-systemrandom.txt"></canvas>

It is important to remember that PRNG outputs are related. The algorithm's internal state is
generating each number, and while the output routine might obfuscate the relation it still did arise
from this process.
