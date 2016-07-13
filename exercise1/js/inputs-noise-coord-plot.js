// <canvas class="numbers-numbers" id="numbers-numbers-naturals" width="900" height="790" data-numbers="_static/65536-naturals.txt"></canvas>

function InputsNoiseCoordlot(canvas_id, bit_width) {
  var _self = this

  _self.canvas = document.getElementById(canvas_id)
  _self.$canvas = jQuery(_self.canvas)
  _self.context = _self.canvas.getContext("2d")

  _self.width = _self.canvas.width
  _self.height = _self.canvas.height - 25
  _self.numberCapacity = _self.width * _self.height

  _self.$canvas.css("background", "white")

  _self.plot_name = _self.$canvas.attr("data-plot-name")

  _self.drawBox()
  _self.i = 0
  _self.storedX = null
}

InputsNoiseCoordlot.prototype.drawBox = function drawBox() {
  var _self = this

  _self.context.textBaseline = "top"
  _self.context.textAlign = "center"
  _self.context.font = "bold 13px sans-serif"

  _self.context.fillStyle = "rgb(255, 255, 255)"
  _self.context.fillRect(0, 0, _self.width, 25)
  _self.context.fillStyle = "rgb(0, 0, 0)"
  _self.context.fillText(_self.plot_name, _self.width / 2, 5)
  _self.context.fillStyle = "rgb(255, 255, 255)"
}

InputsNoiseCoordlot.prototype.drawNumber = function drawNumber(n) {
  var _self = this

  if (_self.storedX === null) {
    _self.storedX = n
    return
  }

  // http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set
  // -a-single-pixel-in-an-html5-canvas
  var p = _self.context.createImageData(1, 1),
      d = p.data
  d[0] = d[1] = d[2] = 0
  d[3] = 255

  /*var x = _self.i % _self.width,
      y = parseInt(Math.floor(_self.i / _self.width))*/
  var x = _self.storedX % _self.width,
      y = n % _self.height
  _self.context.putImageData(p, x, y + 25)

  _self.i = (_self.i + 1) % _self.numberCapacity
  _self.storedX = null
}

InputsNoiseCoordlot.prototype.clear = function () {
  var _self = this

  _self.context.clearRect(0, 0, _self.width, _self.height)
}
