#!/usr/bin/env python3

import os, sys, time, subprocess, re
from cp_randomness import exercise2

# Note: This runs the lottery and returns
total_cost_of_play = 0
def run_lottery(attempt="ffffffff"):
  try:
    # ./hex-lottery ffffffff
    lottery_output = subprocess.check_output(["./hex-lottery", attempt]).decode("utf-8")
  except subprocess.CalledProcessError:
    time.sleep(0.1)
    return run_lottery(attempt)

  observation = {
    "minute": int(re.search("MINUTE ([0-9]+)", lottery_output).group(1)),
    "result": exercise2.Reels.from_reels(re.search("DRAWN   ([0-9a-z ]+)", lottery_output).group(1)),
    "cost_of_play": int(re.search("\$([0-9,]+) a play", lottery_output).group(1).replace(",", ""))
  }
  print("minute='%d' result='%s' cost_of_play='%d'" % (observation["minute"], observation["result"], observation["cost_of_play"]))

  # Simplest way to keep track of total cost of play without classes or extra code.
  global total_cost_of_play
  total_cost_of_play += observation["cost_of_play"]

  return observation

################################################################################
# STUDENT TASK 1: Implement a function to detect the lottery minute changing,
#                 and return the new minute.
# Hint: run run_lottery() in a loop until run_lottery()["minute"] changes.
################################################################################

def detect_changing_minute():
  # @TODO: Implementation.
  return changed_minute

current_minute = detect_changing_minute()

# We're now an exact number of minutes since the lottery began, albeit with some
# amount of random error. The challenge now is determine the exact seed the
# lottery used.

################################################################################
# STUDENT TASK: Implement a function to return the approximate unix time that
#               the lottery began.
# Hint: you're provided with the current minute of the lottery.
# Hint: unix time is the number of seconds since 00:00:00 on January 1st, 1970.
# Hint: you can get the current unix time with int(time.time())
################################################################################

def estimate_start_unixtime(current_minute):
  # @TODO: Implementation.
  return start_unixtime_estimate

start_unixtime_estimate = estimate_start_unixtime(current_minute)

# We now know the seed the lottery used, *assuming* clock drift and our imprecise
# measurements didn't cause any error. Unfortunately that's unlikely to be true.
# A more sophisticated implementation could minimise the issue, but it is easier
# for us to try all seeds within a few seconds of our estimate.

# We now have a good estimate of the unix time at which the lottery was started.
# We also know from our insider that the lottery is seeded with the unix time
# that it is turned on.
#
# Our approach is very imprecise and subject to lots of different errors:
# * The lottery may not tick exactly once a second.
# * Imprecise timing detecting the minute change.
# * Clock drift.
#
# The challenge is to find the correct seed for the CSPRNG despite these errors.
# At the worst we can expect our estimate to be within 4 of the true value.
# But we'll have to try all those seeds to find one that works.

################################################################################
# STUDENT TASK: Write a function to find the correct seed.
# Hint: the correct seed should be within a few seconds of our guess.
################################################################################

def try_a_seed(seed, current_minute):
  csprng = exercise2.Csprng(seed)
  latest_lottery_result_int = run_lottery()["result"].u32
  for i in range(0, current_minute * 60 + 120):
    if csprng.get_current_value() == latest_lottery_result_int:
      return True
    csprng.tick()
  return False

def find_correct_seed(start_unixtime_estimate, current_minute):
  # @TODO: Implementation.
  return start_unixtime

start_unixtime = find_correct_seed(start_unixtime_estimate, current_minute)

################################################################################
# You're done. If you've implemented correctly above, the exploit will work.
# Try running this script,
#   python3 break-lottery.py
################################################################################

# Tick the CSPRNG until it matches a new play.
observation = run_lottery()["result"].u32
csprng = exercise2.Csprng(start_unixtime)
while csprng.get_current_value() != observation:
  csprng.tick()

# Fastforwarding the CSPRNG to the time of line 73 might have taken awhile.
# Thus fastforward again the much smaller amount between then and now.
# After this we'll be pretty up to date. However measuring the time taken for
# operations would be much better than this rough approach.
observation = run_lottery()["result"].u32
while csprng.get_current_value() != observation:
  csprng.tick()

print("Total cost of plays = ${:,}".format(total_cost_of_play))

csprng.tick()
time.sleep(1.0)
guess = exercise2.Reels(csprng.get_current_value())
print("'" + str(guess) + "'")
subprocess.call(["./hex-lottery", str(guess)])
