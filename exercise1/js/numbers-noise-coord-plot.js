// <canvas class="numbers-numbers" id="numbers-numbers-naturals" width="900" height="790" data-numbers="_static/65536-naturals.txt"></canvas>

function NumbersNoiseCoordlot(canvas_id) {
  var _self = this

  _self.canvas = document.getElementById(canvas_id)
  _self.$canvas = jQuery(_self.canvas)
  _self.context = _self.canvas.getContext("2d")

  _self.width = _self.canvas.width
  _self.height = _self.canvas.height - 25
  _self.numberCapacity = _self.width * _self.height

  _self.$canvas.css("background", "white")

  _self.plot_name = _self.$canvas.attr("data-plot-name")
  _self.numbers_path = _self.$canvas.attr("data-numbers-path")
  jQuery.get(_self.numbers_path, function(number_dump) {
    console.log("<" + _self.numbers_path)
    _self.processNumberDump(number_dump)
    _self.drawNumbers()
    console.log(_self.numbers_path + ">")
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

  _self.scale = Math.max(1.0, Math.min(
    parseFloat(_self.width) / _self.maxNumber,
    parseFloat(_self.height) / _self.maxNumber
  ))
}

NumbersNoiseCoordlot.prototype.drawNumbers = function drawNumbers() {
  var _self = this

  var unrendereredCanvas = document.createElement("canvas")
  unrendereredCanvas.width = _self.width
  unrendereredCanvas.height = _self.height
  var unrendereredContext = unrendereredCanvas.getContext("2d")

  for (var i = 0; i + 1 < _self.numbers.length; i++) {
    var proportion = parseFloat(i) / _self.numbers.length
    var intensity = 255 - (55 + parseInt(Math.round(proportion * 200)))
    var x = (_self.numbers[i] % _self.width) * _self.scale,
        y = (_self.numbers[i+1] % _self.height) * _self.scale

    unrendereredContext.beginPath()
    unrendereredContext.rect(x, y, _self.scale, _self.scale)
    unrendereredContext.fillStyle = "rgb(" + intensity + ", " + intensity + ", " + intensity + ")"
    unrendereredContext.fill()
  }

  unrendereredContext.textBaseline = "top"
  unrendereredContext.textAlign = "center"
  unrendereredContext.font = "bold 13px sans-serif"

  unrendereredContext.fillStyle = "rgb(255, 255, 255)"
  unrendereredContext.fillRect(0, 0, _self.width, 25)
  unrendereredContext.fillStyle = "rgb(0, 0, 0)"
  var plot_name_out = _self.plot_name
  if (_self.scale > 1.1) {
    plot_name_out += " (rescaled)"
  }
  unrendereredContext.fillText(plot_name_out, _self.width / 2, 5)

  var unrendereredData = unrendereredContext.getImageData(0, 0, _self.width, _self.height)
  _self.context.putImageData(unrendereredData, 0, 0)
}

jQuery(document).ready(function () {
  $(".numbers-noise-coord-plot").each(function () {
    new NumbersNoiseCoordlot(this.id)
  })
})
