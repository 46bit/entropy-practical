#!/usr/bin/env python

import os, sys, readchar, random, time, socket
from threading import Timer, Thread, Event
from Tyche import FortunaGenerator
# @TODO: ensure PyCrypto installed?

class CSPRNGWrapper(object):
  def __init__(self, seed):
    # @TODO: Seed new CSPRNG.
    self.fortuna = FortunaGenerator()
    self.fortuna.reseed(seed)
    self.tick_count = 0
    # Ensures current_value is not unset.
    self.tick()

  def tick(self):
    # Generate 32-bits from the CSPRNG as the current value.
    self._current_value = self.fortuna.pseudoRandomData(4)
    self.current_value_used = False
    self.tick_count += 1
    #print "CSPRNGWrapper.tick %d" % self.tick_count

  # Prevent each tick's current_value being given out more than once.
  def get_current_value(self):
    if self.current_value_used:
      return False
    self.current_value_used = True
    return self._current_value

seed = "5" # microtime
csprng_wrapper = CSPRNGWrapper(seed)
#for i in range(0, 3600*500):
#  csprng_wrapper.tick()
#  if i % 10000 == 0:
#    print csprng_wrapper.get_current_value()
while True:
  csprng_wrapper.tick()
  v = csprng_wrapper.get_current_value()
  if ord(v[0]) == 0xff and ord(v[1]) == 0xff and ord(v[2]) == 0xff and ord(v[3]) == 0xff:
    print csprng_wrapper.tick_count
    sys.exit(0)
