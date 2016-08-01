function NumbersFrame(container) {
  var _self = this

  _self.container = container
  _self.$container = jQuery(_self.container)
  _self.$pre = _self.$container.children("pre")

  _self.numbers_path = _self.$container.attr("data-numbers-path")
  jQuery.get(_self.numbers_path, function(number_dump) {
    _self.drawNumbers(number_dump)
  })
}

NumbersFrame.prototype.drawNumbers = function drawNumbers(number_dump) {
  var _self = this

  _self.$pre.text(number_dump)
}

jQuery(document).ready(function () {
  $(".numbers-frame").each(function () {
    new NumbersFrame(this)
  })
})
