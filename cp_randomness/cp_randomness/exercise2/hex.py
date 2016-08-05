import string

hex09af = string.hexdigits[:16]

class Reels(object):
  REEL_COUNT = 8

  def __init__(self, u32=0xfffffff):
    if not isinstance(u32, int):
      raise ValueError("Invalid u32 '{}'. Did you want .from_reels?".format(u32))
    self.u32 = u32

  @classmethod
  def from_reels(cls, reels):
    obj = cls()
    obj.u32 = obj.u32_from_reels(reels)
    return obj

  def reels_from_u32(self, u32, joinerstr=""):
    reversed_reels = []
    for reel in range(0, 8):
      reversed_reels.append(hex09af[u32 & 0xf])
      u32 = u32 >> 4
    return joinerstr.join(reversed_reels[::-1])

  def reel_from_u32(self, u32, reel_index):
    start_bit_of_reel = reel_index * 4
    return hex09af[(self.u32 >> start_bit_of_reel) & 0xf]

  def u32_from_reels(self, reels):
    # Remove spaces.
    reels = reels.replace(" ", "")
    u32_value = 0
    for reel in reels:
      u32_value = (u32_value<<4) | hex09af.index(reel)
    return u32_value

  def advance_reel(self, reel_index):
    # The Least Significant Bit position of the 4-bit Reel in Value.
    start_bit_of_reel = reel_index * 4

    # Acquire a value where 0x0..0REEL0..0.
    # Then bitwise AND 0x1..1NOTREEL1..1 with value, in so doing zeroing the 4-bit Reel
    # and leaving the rest of the bits alone.
    value_zeroed_except_reel = self.u32 & (0xf << start_bit_of_reel)
    self.u32 &= ~value_zeroed_except_reel

    # Calculate the advanced Reel value.
    reel_value = value_zeroed_except_reel >> start_bit_of_reel
    new_reel_value = (reel_value + 1) % 16
    # Then bitwise OR with 0x0..0NEWREEL0..1, setting the zeroed Reel bits to their new value.
    self.u32 |= new_reel_value << (reel_index * 4)

  def __str__(self):
    return self.reels_from_u32(self.u32)

  def spaced_str(self):
    return self.reels_from_u32(self.u32, " ")

  def __getitem__(self, reel_index):
    return self.reel_from_u32(self.u32, reel_index)

  def __eq__(self, other):
    return isinstance(other, self.__class__) and (self.__dict__ == other.__dict__)

  def __ne__(self, other):
    return not self.__eq__(other)
