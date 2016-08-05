from threading import Thread, Event

# http://stackoverflow.com/a/12435256
class TickThread(Thread):
  def __init__(self, tick_callback, tick_duration):
    Thread.__init__(self)
    self.stopped = Event()
    self.tick_callback = tick_callback
    self.tick_duration = tick_duration

  # Return False from a callback to end the ticking.
  def run(self):
    while not self.stopped.wait(self.tick_duration):
      if self.tick_callback() is False: break
