#!/usr/bin/env python

import os, sys, readchar, random, time, socket, struct, subprocess, re, string
from threading import Timer, Thread, Event
from datetime import datetime
from Tyche import FortunaGenerator

def lottery_minute():
  # ./hex-lottery ffffffff
  try:
    lottery_output = subprocess.check_output(["./hex-lottery", "ffffffff"])
  except subprocess.CalledProcessError:
    time.sleep(0.1)
    return lottery_minute()
  minute = re.search("MINUTE ([0-9]+)", lottery_output).group(1)
  draw = re.search("DRAWN   ([0-9a-z ]+)", lottery_output).group(1)
  play_cost = int(re.search("\$([0-9,]+) a play", lottery_output).group(1).replace(",", ""))
  return int(minute), draw, play_cost

def estimate_start_time():
  cost_of_play = 0
  observations = []
  start_minute, current_draw, cost_of_play_single = lottery_minute()
  cost_of_play += cost_of_play_single
  print "'" + current_draw + "'"
  observations.append(current_draw)
  current_minute = start_minute
  print start_minute
  while current_minute == start_minute:
    time.sleep(1.0)
    current_minute, current_draw, cost_of_play_single = lottery_minute()
    cost_of_play += cost_of_play_single
    print current_minute
    observations.append(current_draw)

  tick_count_estimate = current_minute * 60
  start_time_estimate = int(time.time()) - tick_count_estimate
  print tick_count_estimate, start_time_estimate
  return tick_count_estimate, start_time_estimate, observations, cost_of_play

#while True:
#  time.sleep(1.0)
#  tick_count_estimate += 1
#  print tick_count_estimate

class CSPRNGWrapper(object):
  def __init__(self, seed, demo_tick_count):
    # @TODO: Seed new CSPRNG.
    self.fortuna = FortunaGenerator()
    self.fortuna.reseed(seed)
    self.tick_count = demo_tick_count
    # Ensures current_value is not unset.
    self.tick()

  def tick(self):
    # Generate 32-bits from the CSPRNG as the current value.
    current_bytes = self.fortuna.pseudoRandomData(4)
    current_value = 0
    for i in range(4):
      current_value = (current_value << 8) | ord(current_bytes[i])
    self._current_value = current_value
    self.current_value_used = False
    self.tick_count += 1
    #print "CSPRNGWrapper.tick %d" % self.tick_count

  # Prevent each tick's current_value being given out more than once.
  def get_current_value(self):
    if self.current_value_used:
      return False
    self.current_value_used = True
    return self._current_value

hex09af = string.hexdigits[:16]

total_cost_of_play = 0

# time.sleep(1.0)
# tick_count_estimate += 1

# csprng_wrapper = CSPRNGWrapper(str(start_time_estimate), 0)
# for i in range(tick_count_estimate):
#   csprng_wrapper.tick()

def u32_to_reels(u32_value):
  return [(u32_value >> (reel*4)) & 0xf for reel in range(0, 8)]

# guess = "".join([hex09af[r] for r in u32_to_reels(csprng_wrapper.get_current_value())])
# print guess

# # use start_time_estimate to try and win
# o = subprocess.check_output(["./hex-lottery", guess])
# print o

def seed_fits_observations(seed, estimated_ticks, observations):
  csprng_wrapper = CSPRNGWrapper(str(seed), 0)
  matches = 0
  previous_match_location = 0
  for i in range(estimated_ticks + 3):
    value = " ".join([hex09af[r] for r in u32_to_reels(csprng_wrapper.get_current_value())]) + " "
    #print "'" + value + "'"
    try:
      observed_i = observations.index(value)
    except ValueError:
      observed_i = False
    if observed_i:# and observed_i >= previous_match_location and observed_i <= i:
      matches += 1
    csprng_wrapper.tick()
  return float(matches) / float(len(observations))

#print seed_fits_observations(1, [1, 2, 3, 4, 5])

tick_count_estimate, start_time_estimate, observations, cost_of_play = estimate_start_time()
total_cost_of_play += cost_of_play
offsets = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 9, -9]
offset_observation_fits = [seed_fits_observations(start_time_estimate + i, tick_count_estimate + i, observations) for i in offsets]
print offset_observation_fits
max_observation_fit = max(offset_observation_fits)
offset_with_max_fit = offsets[offset_observation_fits.index(max_observation_fit)]

tick_count_estimate += offset_with_max_fit
start_time_estimate += offset_with_max_fit
print max_observation_fit, offset_with_max_fit, tick_count_estimate, start_time_estimate

minute, draw, play_cost = lottery_minute()
total_cost_of_play += play_cost
print "'" + draw + "'"
csprng_wrapper = CSPRNGWrapper(str(start_time_estimate), 0)
while " ".join([hex09af[r] for r in u32_to_reels(csprng_wrapper.get_current_value())]) + " " != draw:
  csprng_wrapper.tick()

# Come up to date.
minute, draw, play_cost = lottery_minute()
total_cost_of_play += play_cost
print "'" + draw + "'"
while " ".join([hex09af[r] for r in u32_to_reels(csprng_wrapper.get_current_value())]) + " " != draw:
  csprng_wrapper.tick()

print "Total cost of plays = ${:,}".format(total_cost_of_play)

csprng_wrapper.tick()
time.sleep(1.0)
guess = "".join([hex09af[r] for r in u32_to_reels(csprng_wrapper.get_current_value())])
print guess
subprocess.call(["./hex-lottery", guess])

# # use start_time_estimate to try and win
# o = subprocess.check_output(["./hex-lottery", guess])
# print o

# for i in i_s:
#   offset_start_time_estimate = start_time_estimate + i
#   csprng_wrapper = CSPRNGWrapper(str(start_time_estimate), 0)
#   for i in range(tick_count_estimate + i):
#     csprng_wrapper.tick()
