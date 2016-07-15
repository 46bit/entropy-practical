var ShiftRegister = function(domContainer, bit_width, bits_with_arrows) {
  var _self = this

  _self.domContainer = domContainer
  _self.bit_width = bit_width
  _self.bits_with_arrows = !!bits_with_arrows

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
    "arrowhead_length": 12
  }

  _self.initMachine()

  _self.drawDefinitions()
  _self.drawMachine()
}

ShiftRegister.prototype.initMachine = function initMachine() {
  var _self = this

  _self.bits = []
  for (var b = 0; b < _self.bit_width; b++) {
    var bit = _self.newBit(b, (Math.random() >= 0.5))
    _self.bits.push(bit)
  }
}

ShiftRegister.prototype.newBit = function newBit(bit_index, xor_enabled) {
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
  if (_self.bits_with_arrows) {
    // If arrows between bits, we want bit.size spacing between each bit.
    bit.lx += bit.size * bit.index
  }
  bit.cx = bit.lx + bit.size / 2
  bit.rx = bit.lx + bit.size
  // Y coordinates: top, centre, bottom
  bit.ty = 5
  bit.cy = bit.ty + bit.size / 2
  bit.by = bit.ty + bit.size

  return bit
}

ShiftRegister.prototype.drawDefinitions = function drawDefinitions() {
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

ShiftRegister.prototype.drawMachine = function drawMachine() {
  var _self = this

  var previous_bit = false
  for (var b = _self.bits.length - 1; b >= 0; b--) {
    var bit = _self.bits[b]
    _self.drawBit(bit)

    if (_self.bits_with_arrows && previous_bit) {
      _self.drawBitArrow(bit, previous_bit)
    }

    previous_bit = bit
  }
  _self.drawInOutArrows()
}

ShiftRegister.prototype.drawBit = function drawBit(bit) {
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
      bit.elements.register_text.text(bit.value)
    }.bind(bit))

  bit.elements.register_text_g = bit.elements.fore_g.append("g")

  _self.drawBitCircle(bit)
}

ShiftRegister.prototype.drawBitArrow = function drawBitArrow(left_bit, right_bit) {
  var _self = this

  left_bit.elements.bit_arrow = left_bit.elements.rear_g.append("line")
      .attr("class", left_bit.class + " arrow out_arrow")
      .attr("x1", left_bit.cx)
      .attr("y1", left_bit.cy)
      .attr("x2", right_bit.lx - _self.dimensions.arrowhead_length)
      .attr("y2", right_bit.cy)
}

ShiftRegister.prototype.drawBitCircle = function drawBitCircle(bit) {
  var _self = this

  bit.elements.register_circle = bit.elements.register_text_g.append("circle")
    .attr("class", bit.class + " register_circle")
    .attr("cx", bit.cx)
    .attr("cy", bit.cy)
    .attr("r", bit.size / 4)

  bit.elements.register_text = bit.elements.register_text_g.append("text")
    .attr("class", bit.class + " register_text")
    .attr("x", bit.cx)
    .attr("y", bit.cy)
    .attr("dy", 6) // @TODO: Remove magic constant.
    .attr("text-anchor", "middle")
    .text(bit.value)
}

ShiftRegister.prototype.drawInOutArrows = function drawInOutArrows() {
  var _self = this

  _self.in_arrow = {
    "lx": _self.bits[0].lx - _self.dimensions.bit_size,
    "rx": _self.bits[0].lx - _self.dimensions.arrowhead_length,
    "y": _self.bits[0].cy
  }
  _self.in_arrow.element = _self.rear_space.append("line")
      .attr("class", _self.bits[0].class + " arrow in_arrow")
      .attr("x1", _self.in_arrow.lx)
      .attr("y1", _self.in_arrow.y)
      .attr("x2", _self.in_arrow.rx)
      .attr("y2", _self.in_arrow.y)
  _self.in_arrow.text = _self.rear_space.append("text")
      .attr("class", _self.bits[0].class + " channel_label")
      .attr("x", _self.in_arrow.lx + _self.dimensions.arrowhead_length)
      .attr("y", (_self.bits[0].ty + _self.bits[0].cy) / 2)
      .attr("text-anchor", "start")
      .text("in")

  var final_bit = _self.bits[_self.bits.length - 1]
  _self.out_arrow = {
    "lx": final_bit.rx,
    "rx": final_bit.rx + _self.dimensions.bit_size - _self.dimensions.arrowhead_length,
    "y": final_bit.cy
  }
  _self.out_arrow.element = _self.rear_space.append("line")
      .attr("class", final_bit.class + " arrow out_arrow")
      .attr("x1", _self.out_arrow.lx)
      .attr("y1", _self.out_arrow.y)
      .attr("x2", _self.out_arrow.rx)
      .attr("y2", _self.out_arrow.y)
  _self.out_arrow.text = _self.rear_space.append("text")
      .attr("class", final_bit.class + " channel_label")
      .attr("x", _self.out_arrow.rx)
      .attr("y", (final_bit.ty + final_bit.cy) / 2)
      .attr("text-anchor", "end")
      .text("out")
}

ShiftRegister.prototype.tick = function tick() {
  var _self = this

  for (var i = _self.bits.length - 1; i >= 0; i--) {
    var bit = _self.bits[i],
        source_bit_value = (i > 0) ? _self.bits[i-1].value : ((Math.random() >= 0.5) ? 1 : 0)

    bit.value = source_bit_value
    bit.elements.register_text
      .text(bit.value)
    /*bit.elements.register_text
      .transition()
      .attr("x", bit.cx + _self.dimensions.bit_size)*/
    /*bit.elements.register_circle
      .transition()
      .attr("cx", (i == _self.bits.length - 1) ? _self.width + 100 : bit.cx + _self.dimensions.bit_size)
      .style("opacity", (i == _self.bits.length - 1) ? 0.5 : 1)
    bit.elements.register_text
      .transition()
      .attr("x", (i == _self.bits.length - 1) ? _self.width + 100 : bit.cx + _self.dimensions.bit_size)
      .style("opacity", (i == _self.bits.length - 1) ? 0.5 : 1)*/
  }
}

ShiftRegister.prototype.polyline_points = function polyline_points(points) {
  var points_str = ""
  for (i in points) {
    points_str += points[i].join(",") + " "
  }
  return points_str
}
