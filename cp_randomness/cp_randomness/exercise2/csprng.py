import sys, Tyche

class Csprng(object):
  def __init__(self, seed, write_dots=False):
    self.write_dots = write_dots
    self.reseed(seed)

    # Ensures current_value is not unset.
    self.tick()

  def tick(self):
    # Generate 32-bits from the CSPRNG as the current value.
    self._current_value = self.bytes_to_u32(self.fortuna.pseudoRandomData(4))
    self.tick_count += 1
    if self.write_dots:
      sys.stdout.write(".")
      sys.stdout.flush()

  def advance(self, ticks):
    for t in range(ticks):
      self.tick()

  def reseed(self, seed):
    # Seed a Fortuna instance from the Tyche package.
    self.fortuna = Tyche.FortunaGenerator()
    self.fortuna.reseed(bytes(str(seed), "utf-8"))
    self.tick_count = 0

  def bytes_to_u32(self, bs):
    u32 = 0
    for b in bs:
      u32 = (u32 << 8) | (b & 0xff)
    return u32

  # Prevent each tick's current_value being given out more than once.
  def get_current_value(self):
    return self._current_value
