function CycleCounter() {
  var _self = this

  _self.reset()
}

CycleCounter.prototype.reset = function reset() {
  var _self = this

  _self.i = 0
  _self.last_seen_at_time = {}
}

CycleCounter.prototype.countValue = function countValue(n) {
  var _self = this

  if (n in _self.last_seen_at_time) {
    return _self.i - _self.last_seen_at_time[n]
  }

  _self.last_seen_at_time[n] = _self.i
  _self.i++
  return false
}
