jQuery(document).ready(function () {
  $(".reveal-tick").each(function () {
    console.log(".reveal-tick")
    var $reveal_tick = $(this)
    var $reveal = $reveal_tick.siblings(".reveal")
    var $checkbox = $reveal_tick.children("input")
    $checkbox.on("change", function () {
      console.log($reveal)
      if ($checkbox.is(':checked')) {
        console.log(".reveal-tick checkbox change on")
        $reveal.slideDown()
      } else {
        console.log(".reveal-tick checkbox change off")
        $reveal.slideUp()
      }
    })
  })
})
