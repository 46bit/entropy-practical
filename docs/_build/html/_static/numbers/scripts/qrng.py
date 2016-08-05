import quantumrandom, math

l = 65536

u16s = []
for i in range(0, int(math.ceil(l * 2.0 / 1000))):
  u16s += quantumrandom.get_data(data_type='uint16', array_length=1000)

for i in range(0, l):
  u32 = (u16s[i*2] << 16) | u16s[i*2 + 1]
  print u32
