var FeedbackShiftRegister = function(domContainer, bit_width) {
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
    "arrowhead_length": 12
  }

  _self.initMachine()

  _self.drawDefinitions()
  _self.drawMachine()
}

FeedbackShiftRegister.prototype.initMachine = function initMachine() {
  var _self = this

  _self.bits = []
  for (var b = 0; b < _self.bit_width; b++) {
    var bit = _self.newBit(b, (Math.random() >= 0.5))
    _self.bits.push(bit)
  }
}

FeedbackShiftRegister.prototype.newBit = function newBit(bit_index, xor_enabled) {
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

  return bit
}

FeedbackShiftRegister.prototype.drawDefinitions = function drawDefinitions() {
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

FeedbackShiftRegister.prototype.drawMachine = function drawMachine() {
  var _self = this

  for (var b = _self.bits.length - 1; b >= 0; b--) {
    var bit = _self.bits[b]
    _self.drawBit(bit)
  }
  _self.drawInOutArrows()
}

FeedbackShiftRegister.prototype.drawBit = function drawBit(bit) {
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

FeedbackShiftRegister.prototype.drawBitCircle = function drawBitCircle(bit) {
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

FeedbackShiftRegister.prototype.drawInOutArrows = function drawInOutArrows() {
  var _self = this

  var end_bit = _self.bits[_self.bits.length - 1],
      start_bit = _self.bits[0]
  _self.feedback_line = _self.rear_space.append("polyline")
    .attr("class", "arrow feedback_line")
    .attr("points", _self.polyline_points([
      [end_bit.cx, end_bit.cy],
      [end_bit.cx, end_bit.by + _self.dimensions.bit_size / 3],
      [5, end_bit.by + _self.dimensions.bit_size / 3],
      [5, start_bit.cy],
      [start_bit.lx - _self.dimensions.arrowhead_length, start_bit.cy]
    ]))
  _self.feedback_line3 = _self.rear_space.append("polyline")
    .attr("class", "arrow feedback_line")
    .attr("points", _self.polyline_points([
      [end_bit.cx, end_bit.cy],
      [end_bit.cx, end_bit.by + _self.dimensions.bit_size / 3],
      [5 + _self.dimensions.arrowhead_length, end_bit.by + _self.dimensions.bit_size / 3]
    ]))
  _self.feedback_line4 = _self.rear_space.append("polyline")
    .attr("class", "arrow feedback_line")
    .attr("points", _self.polyline_points([
      [end_bit.cx, end_bit.cy],
      [end_bit.cx, end_bit.by + _self.dimensions.bit_size / 3 - _self.dimensions.arrowhead_length]
    ]))
}

FeedbackShiftRegister.prototype.tick = function tick() {
  var _self = this

  _self.rear_space.attr("class", "rear_space ticking")
  setTimeout(function () {
    _self.rear_space.attr("class", "rear_space")
  }, 500)

  var feedback = _self.bits[_self.bits.length - 1].value
  // Skip the last element.
  for (var i = _self.bits.length - 2; i >= 0; i--) {
    _self.bits[i+1].value = _self.bits[i].value
    _self.bits[i+1].elements.register_text.text(_self.bits[i+1].value)
  }
  _self.bits[0].value = feedback
  _self.bits[0].elements.register_text.text(_self.bits[0].value)

  /*for (var i = _self.bits.length - 1; i >= 0; i--) {
    var bit = _self.bits[i]
    //bit.elements.register_text
    //  .transition()
    //  .attr("x", bit.cx + _self.dimensions.bit_size)
    bit.elements.register_circle
      .transition()
      .attr("cx", (i == _self.bits.length - 1) ? _self.width + 100 : bit.cx + _self.dimensions.bit_size)
      .style("opacity", (i == _self.bits.length - 1) ? 0.5 : 1)
    bit.elements.register_text
      .transition()
      .attr("x", (i == _self.bits.length - 1) ? _self.width + 100 : bit.cx + _self.dimensions.bit_size)
      .style("opacity", (i == _self.bits.length - 1) ? 0.5 : 1)
  }*/
}

FeedbackShiftRegister.prototype.polyline_points = function polyline_points(points) {
  var points_str = ""
  for (i in points) {
    points_str += points[i].join(",") + " "
  }
  return points_str
}
