// <canvas class="numbers-numbers" id="numbers-numbers-naturals" width="900" height="790" data-numbers="_static/65536-naturals.txt"></canvas>

function NumbersNoiseCoordlot(canvas_id) {
  var _self = this

  _self.canvas = document.getElementById(canvas_id)
  _self.$canvas = jQuery(_self.canvas)
  _self.context = _self.canvas.getContext("2d")

  _self.width = _self.canvas.width
  _self.height = _self.canvas.height - 25
  _self.numberCapacity = _self.width * _self.height

  _self.$canvas.css("border-width", "1px")
  _self.$canvas.css("border-color", "black")
  _self.$canvas.css("background", "black")

  _self.plot_name = _self.$canvas.attr("data-plot-name")
  _self.numbers_path = _self.$canvas.attr("data-numbers-path")
  jQuery.get(_self.numbers_path, function(number_dump) {
    _self.processNumberDump(number_dump)
    _self.drawNumbers()
  })
}

NumbersNoiseCoordlot.prototype.processNumberDump = function processNumberDump(number_dump) {
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

NumbersNoiseCoordlot.prototype.drawNumbers = function drawNumbers() {
  var _self = this

  // http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set
  // -a-single-pixel-in-an-html5-canvas
  var p = _self.context.createImageData(1, 1),
      d = p.data
  d[3] = 255

  for (var i = 0; i + 1 < _self.numbers.length; i += 2) {
    var proportion = parseFloat(i) / _self.numbers.length
    var colourmap_entry_index = numbers_colourmap.length - 1 - parseInt(Math.floor(proportion * numbers_colourmap.length)),
        colourmap_entry = numbers_colourmap[colourmap_entry_index]
    colourmap_entry = [parseInt(Math.floor(proportion * 255)), parseInt(Math.floor(proportion * 255)), parseInt(Math.floor(proportion * 255))]
    d[0] = parseInt(Math.round(colourmap_entry[0] * 255))
    d[1] = parseInt(Math.round(colourmap_entry[1] * 255))
    d[2] = parseInt(Math.round(colourmap_entry[2] * 255))
    var x = _self.numbers[i] % _self.width,
        y = _self.numbers[i+1] % _self.height

    if (_self.maxNumber < _self.width || _self.maxNumber < _self.height) {
      var scale = Math.max(parseFloat(_self.width) / _self.maxNumber, parseFloat(_self.height) / _self.maxNumber)
      for (x = _self.numbers[i] * scale - 0.5 * scale; x < _self.numbers[i] * scale + 0.5 * scale; x++) {
        for (y = _self.numbers[i+1] * scale - 0.5 * scale; y < _self.numbers[i+1] * scale + 0.5 * scale; y++) {
          _self.context.putImageData(p, x, y + 25)
        }
      }
    } else {
      _self.context.putImageData(p, x, y + 25)
    }
  }

  _self.context.textBaseline = "top"
  _self.context.textAlign = "left"
  _self.context.font = "bold 13px Helvetica"

  _self.context.fillStyle = "rgb(255, 255, 255)"
  _self.context.fillRect(0, 0, _self.width, 25)
  _self.context.fillStyle = "rgb(0, 0, 0)"
  _self.context.fillText(_self.plot_name, 15, 5)
}

jQuery(document).ready(function () {
  $(".numbers-noise-coord-plot").each(function () {
    new NumbersNoiseCoordlot(this.id)
  })
})
