var LFSRHeadless = function(bit_width) {
  var _self = this

  _self.bit_width = bit_width

  _self.initMachine()
}

LFSRHeadless.prototype.initMachine = function initMachine() {
  var _self = this

  _self.bits = []
  for (var b = 0; b < _self.bit_width; b++) {
    var bit = _self.newBit(b, (Math.random() >= 0.5))
    _self.bits.push(bit)
  }
}

LFSRHeadless.prototype.newBit = function newBit(bit_index, xor_enabled) {
  var _self = this

  var bit = {
    "index": bit_index,
  }

  bit.value = (Math.random() >= 0.5) ? 1 : 0

  bit.xor = _self.newXor(bit, xor_enabled)

  return bit
}

LFSRHeadless.prototype.newXor = function newXor(bit, xor_enabled) {
  var _self = this

  var xor = {
    "index": bit.index,
    "enabled": !!xor_enabled,
  }

  return xor
}

LFSRHeadless.prototype.state = function state() {
  var _self = this

  var value = 0
  for (var i = 0; i < _self.bits.length; i++) {
    value = (value << 1) | _self.bits[i].value
  }
  return value
}

LFSRHeadless.prototype.tick = function tick() {
  var _self = this

  var feedback = 0
  for (var i = _self.bits.length - 1; i >= 0; i--) {
    if (_self.bits[i].xor.enabled) {
      feedback ^= _self.bits[i].value
    }
  }

  for (var i = _self.bits.length - 1; i >= 0; i--) {
    var previous_bit_value = (i > 0) ? _self.bits[i-1].value : feedback
    _self.bits[i].value = previous_bit_value
  }
}
