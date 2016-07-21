import sys, socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("127.0.0.1", 4646))

data = s.recv(4)
if len(data) == 0:
  raise ValueError("No data received.")
print [ord(b) for b in data]
