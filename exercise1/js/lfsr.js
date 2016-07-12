var LFSR = function(domContainer, bit_width) {
  var _self = this

  _self.domContainer = domContainer
  _self.bit_width = bit_width

  _self.container = d3.select(_self.domContainer)
  _self.$container = $(_self.domContainer)
  _self.width = _self.$container.width()
  _self.height = _self.$container.height()

  _self.svg = _self.container.append("svg")
    .attr("width", _self.width)
    .attr("height", _self.height)
  _self.rear_space = _self.svg.append("g")
    .attr("class", "rear_space")
  _self.fore_space = _self.svg.append("g")
    .attr("class", "fore_space")

  _self.dimensions = {
    "bit_size": 60,
    "xor_radius": 12,
    "xor_hint_radius": 5,
    "arrowhead_length": 12,
    "bit_xor_space": 56,
    "feedback_left_margin": 5
  }

  _self.initMachine()

  _self.drawDefinitions()
  _self.drawMachine()
  _self.render()
}

LFSR.prototype.initMachine = function initMachine() {
  var _self = this

  _self.bits = []
  for (var b = 0; b < _self.bit_width; b++) {
    var bit = _self.newBit(b, (Math.random() >= 0.5))
    _self.bits.push(bit)
  }
}

LFSR.prototype.newBit = function newBit(bit_index, xor_enabled) {
  var _self = this

  var bit = {
    "index": bit_index,
    "class": "bit",
    "size": _self.dimensions.bit_size,
    "elements": {}
  }

  bit.value = (Math.random() >= 0.5) ? 1 : 0

  // X coordinates: left, centre, right
  bit.lx = bit.size * (1 + bit.index)
  bit.cx = bit.lx + bit.size / 2
  bit.rx = bit.lx + bit.size
  // Y coordinates: top, centre, bottom
  bit.ty = 5
  bit.cy = bit.ty + bit.size / 2
  bit.by = bit.ty + bit.size

  bit.xor = _self.newXor(bit, xor_enabled)

  return bit
}

LFSR.prototype.newXor = function newXor(bit, xor_enabled) {
  var _self = this

  var xor = {
    "index": bit.index,
    "class": "xor",
    "enabled": !!xor_enabled,
    "elements": {}
  }

  xor.radius = _self.dimensions.xor_radius
  xor.hint_radius = _self.dimensions.xor_hint_radius

  // X coordinates: centre, left, right
  xor.cx = bit.cx
  xor.lx = xor.cx - xor.radius
  xor.rx = xor.cx + xor.radius
  // Y coordinates: centre, top, bottom
  xor.cy = bit.by + _self.dimensions.bit_xor_space
  xor.ty = xor.cy - xor.radius
  xor.by = xor.cy + xor.radius

  return xor
}

LFSR.prototype.drawDefinitions = function drawDefinitions() {
  var _self = this

  _self.defs = _self.rear_space.append("defs")
  _self.arrowMarker = _self.defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", _self.dimensions.arrowhead_length / 4)
    .attr("markerHeight", _self.dimensions.arrowhead_length / 4)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5Z")
}

LFSR.prototype.drawMachine = function drawMachine() {
  var _self = this

  var previous_bit = false
  for (var b = _self.bits.length - 1; b >= 0; b--) {
    var bit = _self.bits[b]
    _self.drawBit(bit)
    _self.drawXorSymbol(bit)
    _self.drawXorArrows(bit, previous_bit)
    previous_bit = bit
  }
}

LFSR.prototype.drawBit = function drawBit(bit) {
  var _self = this

  bit.elements.fore_g = _self.fore_space.append("g")
    .attr("class", "bit")

  bit.elements.rear_g = _self.rear_space.append("g")
    .attr("class", "bit")

  bit.elements.register_rect = bit.elements.fore_g.append("rect")
    .attr("class", bit.class + " register_rect")
    .attr("x", bit.lx)
    .attr("y", bit.ty)
    .attr("width", bit.size)
    .attr("height", bit.size)
    .on("click", function () {
      bit.value = (bit.value + 1) % 2
      _self.render()
    }.bind(bit))

  bit.elements.register_text = bit.elements.fore_g.append("text")
    .attr("class", bit.class + " register_text")
    .attr("x", bit.cx)
    .attr("y", bit.cy)
    .attr("dy", 6) // @TODO: Remove magic constant.
    .attr("text-anchor", "middle")
    .text(bit.value)
}

LFSR.prototype.drawXorSymbol = function drawXorSymbol(bit) {
  var _self = this,
      xor = bit.xor

  xor.elements.fore_g = bit.elements.fore_g.append("g")
    .attr("class", "xor " + ((xor.enabled) ? "enabled" : "disabled"))

  xor.elements.hint_circle = xor.elements.fore_g.append("circle")
    .attr("class", xor.class + " hint_circle")
    .attr("r", xor.hint_radius)
    .attr("cx", xor.cx)
    .attr("cy", xor.cy)
    .on("click", function () {
      bit.xor.enabled = !bit.xor.enabled
      _self.render()
    }.bind(bit))

  xor.elements.symbol_circle = xor.elements.fore_g.append("circle")
    .attr("class", xor.class + " symbol_circle")
    .attr("r", xor.radius)
    .attr("cx", xor.cx)
    .attr("cy", xor.cy)
    .on("click", function () {
      bit.xor.enabled = !bit.xor.enabled
      _self.render()
    }.bind(bit))

  xor.elements.symbol_hoz_line = xor.elements.fore_g.append("line")
    .attr("class", xor.class + " symbol_hoz_line symbol_line")
    .attr("x1", xor.lx)
    .attr("y1", xor.cy)
    .attr("x2", xor.rx)
    .attr("y2", xor.cy)

  xor.elements.symbol_ver_line = xor.elements.fore_g.append("line")
    .attr("class", xor.class + " symbol_ver_line symbol_line")
    .attr("x1", xor.cx)
    .attr("y1", xor.ty)
    .attr("x2", xor.cx)
    .attr("y2", xor.by)
}

LFSR.prototype.drawXorArrows = function drawXorArrows(tap_bit, in_bit) {
  var _self = this

  tap_bit.xor.elements.rear_g = tap_bit.elements.rear_g.append("g")
    .attr("class", "xor " + ((tap_bit.xor.enabled) ? "enabled" : "disabled"))

  if (in_bit) {
    // Arrow from Bit Register to XOR.
    tap_bit.xor.elements.bit_xor_arrow = tap_bit.xor.elements.rear_g.append("line")
      .attr("class", tap_bit.xor.class + " bit_xor_arrow arrow xor_arrow")
      .attr("x1", tap_bit.cx)
      .attr("y1", tap_bit.cy)
      .attr("x2", tap_bit.xor.cx)
      .attr("y2", tap_bit.xor.ty - _self.dimensions.arrowhead_length)

    // Arrow from right XOR to this XOR.
    tap_bit.xor.elements.feedback_xor_arrow = tap_bit.xor.elements.rear_g.append("line")
      .attr("class", tap_bit.xor.class + " feedback_xor_arrow arrow xor_arrow")
      .attr("x1", in_bit.xor.cx)
      .attr("y1", in_bit.xor.cy)
      .attr("x2", tap_bit.xor.rx + _self.dimensions.arrowhead_length)
      .attr("y2", tap_bit.xor.cy)
  }

  tap_bit.xor.elements.feedback_line = tap_bit.xor.elements.rear_g.append("polyline")
    .attr("class", tap_bit.xor.class + " arrow feedback_line")
    .attr("points", _self.polyline_points([
      [tap_bit.cx, tap_bit.cy],
      [tap_bit.xor.cx, tap_bit.xor.cy],
      [_self.dimensions.feedback_left_margin, _self.bits[0].xor.cy],
      [_self.dimensions.feedback_left_margin, _self.bits[0].cy],
      [_self.bits[0].lx - _self.dimensions.arrowhead_length, _self.bits[0].cy]
    ]))
}

LFSR.prototype.render = function render() {
  var _self = this

  var encountered_tap = false
  for (var b = _self.bits.length - 1; b >= 0; b--) {
    var bit = _self.bits[b]

    var rightmost = (bit.xor.enabled && !encountered_tap)
    if (rightmost) {
      encountered_tap = true
    }

    bit.elements.register_text.text(bit.value)

    var xor_g_class = "xor " + ((bit.xor.enabled) ? "enabled" : "disabled") + (rightmost ? " rightmost" : "")
    bit.xor.elements.fore_g.attr("class", xor_g_class)
    bit.xor.elements.rear_g.attr("class", xor_g_class)
  }
}

LFSR.prototype.polyline_points = function polyline_points(points) {
  var points_str = ""
  for (i in points) {
    points_str += points[i].join(",") + " "
  }
  return points_str
}

jQuery(document).ready(function () {
  window.lfsrs = []
  d3.selectAll(".lfsr").select(function () {
    var lfsr = new LFSR(this, parseInt($(this).attr("data-bit-width")))
    window.lfsrs.push(lfsr)
  })
})
