jQuery(document).ready(function () {
  d3.selectAll(".lfsr").select(function () {
    console.log(this)
    var container = d3.select(this),
        $container = $(this)
    var svg = container.append("svg")
      .attr("width", $container.width())
      .attr("height", $container.height())
    var back_space = svg.append("g"),
        fore_space = svg.append("g")

    var ui_bit_dimension = 60,
        ui_xor_radius = 12,
        ui_xor_hint_radius = 5,
        arrowhead_dimension = 6,
        arrow_short = arrowhead_dimension * 2

    var bitwidth = 8

    // Define style for arrows.
    var defs = back_space.append("defs")
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 0)
      .attr("refY", 0)
      .attr("markerWidth", arrowhead_dimension / 2)
      .attr("markerHeight", arrowhead_dimension / 2)
      .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5Z")

    var bits = []
    for (var b = 0; b < bitwidth; b++) {
      var bit = {
        "b": b,
        "x": ui_bit_dimension * (1 + b),
        "y": 5,
        "size": ui_bit_dimension,
        "xor": false,
        "class": "bit",
        "value": (Math.random() >= 0.5) ? 1 : 0
      }
      bit.cx = bit.x + bit.size / 2
      bit.cy = bit.y + bit.size / 2
      if (Math.random() > 0.4 || bit.b + 1 == bitwidth) {
        bit.xor = {
          "b": b,
          "cx": ui_bit_dimension * (1 + b + 0.5),
          "cy": 5 + ui_bit_dimension * 2,
          "r": ui_xor_radius,
          "class": "xor"
        }
      } else {
        bit.xor_hint = {
          "b": b,
          "cx": ui_bit_dimension * (1 + b + 0.5),
          "cy": 5 + ui_bit_dimension * 2,
          "r": ui_xor_hint_radius,
          "class": "xor-hint"
        }
      }
      bits.push(bit)
    }

    var previous_xor = false
    for (var b = 0; b < bits.length; b++) {
      var bit = bits[b]

      // Draw bit box
      bit.box_el = fore_space.append("rect")
        .attr("class", bit.class)
        .attr("x", bit.x)
        .attr("y", bit.y)
        .attr("width", bit.size)
        .attr("height", bit.size)
        .on("click", function () {
          this.value = (this.value + 1) % 2
          this.text_el.text(this.value)
        }.bind(bit))

      // Draw bit text
      bit.text_el = fore_space.append("text")
        .attr("class", bit.class)
        .attr("x", bit.cx)
        .attr("y", bit.cy)
        .attr("dy", 6)
        .attr("text-anchor", "middle")
        .text(bit.value)

      if (bit.xor) {
        if (!previous_xor) {
          // Arrow from XOR to 1st bit feedback.
          back_space.append("polyline")
            .attr("class", "arrow")
            .attr("points", polyline_points([
              [bit.xor.cx, bit.xor.cy],
              [5, bit.xor.cy],
              [5, bits[0].cy],
              [bits[0].x - arrow_short, bits[0].cy]
            ]))
        } else {
          // Arrow from XOR to Previous XOR.
          back_space.append("polyline")
            .attr("class", "arrow")
            .attr("points", polyline_points([
              [bit.xor.cx, bit.xor.cy],
              [previous_xor.cx + previous_xor.r + arrow_short, previous_xor.cy]
            ]))
        }

        // Arrow from bit to XOR.
        back_space.append("polyline")
          .attr("class", "arrow")
          .attr("points", polyline_points([
            [bit.cx, bit.y + bit.size],
            [bit.xor.cx, bit.xor.cy - bit.xor.r - arrow_short]
          ]))

        // Draw XOR: circle, horizontal line, vertical line.
        fore_space.append("circle")
          .attr("class", "xor")
          .attr("r", bit.xor.r)
          .attr("cx", bit.xor.cx)
          .attr("cy", bit.xor.cy)
          .on("click", function () {
            bit.xor = false
            // @TODO: Render this.
          }.bind(bit))
        fore_space.append("line")
          .attr("class", "xor")
          .attr("x1", bit.xor.cx - bit.xor.r)
          .attr("y1", bit.xor.cy)
          .attr("x2", bit.xor.cx + bit.xor.r)
          .attr("y2", bit.xor.cy)
        fore_space.append("line")
          .attr("class", "xor")
          .attr("x1", bit.xor.cx)
          .attr("y1", bit.xor.cy - bit.xor.r)
          .attr("x2", bit.xor.cx)
          .attr("y2", bit.xor.cy + bit.xor.r)

        previous_xor = bit.xor
      } else {
        fore_space.append("circle")
          .attr("class", "xor-hint")
          .attr("r", bit.xor_hint.r)
          .attr("cx", bit.xor_hint.cx)
          .attr("cy", bit.xor_hint.cy)
      }
    }
  })
})

function polyline_points(points) {
  var points_str = ""
  for (i in points) {
    points_str += points[i].join(",") + " "
  }
  return points_str
}
