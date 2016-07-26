import exercise2

class CsprngSingleAccess(exercise2.Csprng):
  def tick(self):
    super(CsprngSingleAccess, self).tick()
    self.current_value_used = False

  # Prevent each tick's current_value being given out more than once.
  def get_current_value(self):
    if self.current_value_used:
      return False
    self.current_value_used = True
    return self._current_value
