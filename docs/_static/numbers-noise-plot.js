// <canvas class="numbers-numbers" id="numbers-numbers-naturals" width="900" height="790" data-numbers="_static/65536-naturals.txt"></canvas>

function NumbersNoisePlot(canvas_id) {
  var _self = this

  _self.canvas = document.getElementById(canvas_id)
  _self.$canvas = jQuery(_self.canvas)
  _self.context = _self.canvas.getContext("2d")

  _self.width = _self.canvas.width
  _self.height = _self.canvas.height
  _self.numberCapacity = _self.width * _self.height

  _self.$canvas.css("border-width", "1px")
  _self.$canvas.css("border-color", "black")

  _self.numbers_path = _self.$canvas.attr("data-numbers-path")
  jQuery.get(_self.numbers_path, function(number_dump) {
    _self.processNumberDump(number_dump)
    _self.drawNumbers()
  })
}

NumbersNoisePlot.prototype.processNumberDump = function processNumberDump(number_dump) {
  var _self = this

  var number_strings = number_dump.split("\n"),
      number_strings_length = number_strings.length
  _self.numbers = []
  for (var i = 0; i < _self.numberCapacity && i < number_strings_length; i++) {
    var number_str = number_strings[i]
    if (number_str.length == 0) continue
    _self.numbers.push(parseInt(number_str))
  }
  _self.maxNumber = Math.max.apply(null, _self.numbers)
}

NumbersNoisePlot.prototype.drawNumbers = function drawNumbers() {
  var _self = this

  // http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set
  // -a-single-pixel-in-an-html5-canvas
  var p = _self.context.createImageData(1, 1),
      d = p.data
  d[3] = 255

  var i = 0
  for (var y = 0; y < _self.height; y++) {
    for (var x = 0; x < _self.width; x++) {
      var brightness = 255 - parseInt(Math.round(255 * (_self.numbers[i] / _self.maxNumber)))
      d[0] = d[1] = d[2] = brightness
      _self.context.putImageData(p, x, y)
      i++
      if (i >= _self.numbers.length) {
        return
      }
    }
  }

}

jQuery(document).ready(function () {
  $(".numbers-noise-plot").each(function () {
    new NumbersNoisePlot(this.id)
  })
})
