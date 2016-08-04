#!/usr/bin/env python3

import os, sys, time, subprocess, re
from randompy import exercise2

total_cost_of_play = 0

def hex_lottery(attempt="ffffffff"):
  try:
    # ./hex-lottery ffffffff
    lottery_output = subprocess.check_output(["./hex-lottery", attempt]).decode("utf-8")
  except subprocess.CalledProcessError:
    time.sleep(0.1)
    return hex_lottery(attempt)

  observation = {
    "minute": int(re.search("MINUTE ([0-9]+)", lottery_output).group(1)),
    "result": exercise2.Reels.from_reels(re.search("DRAWN   ([0-9a-z ]+)", lottery_output).group(1)),
    "cost_of_play": int(re.search("\$([0-9,]+) a play", lottery_output).group(1).replace(",", ""))
  }
  print("minute=%d result='%s' cost_of_play=%d" % (observation["minute"], observation["result"], observation["cost_of_play"]))

  # Simplest way to keep track of total cost of play without classes or extra code.
  global total_cost_of_play
  total_cost_of_play += observation["cost_of_play"]

  return observation

################################################################################
# STUDENT TASK: Write a function to detect the minute changing, and estimate
#               from this the unix timestamp when the CSPRNG was started.
#               Name this function `estimate_start_time` as below.
# Hint: the start time was X minutes ago. You can get the current unix timestamp
#       with int(time.time())
# Hint: you want to keep running the lottery until the minute changes.
################################################################################

# def estimate_start_time():
#   # @TODO: Student.

def estimate_start_time():
  observations = []
  minute_has_changed = False
  while not minute_has_changed:
    observation = hex_lottery()
    minute_has_changed = (len(observations) > 0 and observation["minute"] != observations[-1]["minute"])
    observations.append(observation)
    time.sleep(1.0)

  tick_count_estimate = observations[-1]["minute"] * 60
  start_time_estimate = int(time.time()) - tick_count_estimate

  print(tick_count_estimate, start_time_estimate)
  return tick_count_estimate, start_time_estimate, [observation["result"].u32 for observation in observations]

def seed_fits_observations(seed, estimated_ticks, observations):
  csprng = exercise2.Csprng(seed)
  matches = 0
  previous_match_location = 0
  for i in range(estimated_ticks + 3):
    value = csprng.get_current_value()
    #print "'" + value + "'"
    try:
      observed_i = observations.index(value)
    except ValueError:
      observed_i = False
    if observed_i:# and observed_i >= previous_match_location and observed_i <= i:
      matches += 1
    csprng.tick()
  return float(matches) / float(len(observations))

tick_count_estimate, start_time_estimate, observations = estimate_start_time()

# We know now how many ticks have taken place. Each tick is designed to take about 1
# second, but that's probably not exact. You might find ticks happen on average a
# little over 1s, because of the time to schedule the next tick.
#
# So the challenge is finding the correct seed for the CSPRNG. This should be very
# close to the current unix time minus the number of ticks. We can find this in two
# ways:

# But we do not know how much time
# has elapsed.

################################################################################
# STUDENT TASK: Write a function to find the correct seed.
#               Name this function `find_correct_seed` as below. You'll get your
#               start time estimate as a parameter.
# Hint: the correct seed should be within a few seconds of our guess.
################################################################################

# def find_correct_seed(start_time_estimate):
#   # @TODO: Student.

offsets = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 9, -9, 10, -10, 11, -11]
offset_observation_fits = [seed_fits_observations(start_time_estimate + i, tick_count_estimate + i, observations) for i in offsets]
print(offset_observation_fits)
max_observation_fit = max(offset_observation_fits)
offset_with_max_fit = offsets[offset_observation_fits.index(max_observation_fit)]

tick_count_estimate += offset_with_max_fit
start_time_estimate += offset_with_max_fit
print(max_observation_fit, offset_with_max_fit, tick_count_estimate, start_time_estimate)

# Tick the CSPRNG until it matches a new play.
observation = hex_lottery()
print("'" + str(observation["result"]) + "'")
csprng = exercise2.Csprng(start_time_estimate)
while csprng.get_current_value() != observation["result"].u32:
  csprng.tick()

# Fastforwarding the CSPRNG to the time of line 73 might have taken awhile.
# Thus fastforward again the much smaller amount between then and now.
# After this we'll be pretty up to date. However measuring the time taken for
# operations would be much better than this rough approach.
observation = hex_lottery()
print("'" + str(observation["result"]) + "'")
while csprng.get_current_value() != observation["result"].u32:
  csprng.tick()

print("Total cost of plays = ${:,}".format(total_cost_of_play))

csprng.tick()
time.sleep(1.0)
guess = exercise2.Reels(csprng.get_current_value())
print("'" + str(guess) + "'")
subprocess.call(["./hex-lottery", str(guess)])
