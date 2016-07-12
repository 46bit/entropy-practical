jQuery(document).ready(function () {
  d3.selectAll(".lfsr").select(function () {
    console.log(this)
    var container = d3.select(this),
        $container = $(this)
    var svg = container.append("svg")
      .attr("width", $container.width())
      .attr("height", $container.height())
    var g = svg.append("g")//.classed("lfsr-machine")

    var ui_bit_dimension = 60,
        ui_xor_radius = 12,
        arrowhead_dimension = 6,
        arrow_short = arrowhead_dimension * 2

    var bitwidth = 8

    // Define style for arrows.
    var defs = g.append("defs")
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

    // Line from tap on bit 1 around to feedback into bit 1.
    /*g.append("polyline")
      .attr("class", "arrow")
      .attr("points", polyline_points([
        [ui_bit_dimension * (1 + 0.5), 5 + ui_bit_dimension * 2],
        [5, 5 + ui_bit_dimension * 2],
        [5, 5 + ui_bit_dimension / 2],
        [ui_bit_dimension - 2*arrowhead_dimension, 5 + ui_bit_dimension / 2]
      ]))*/

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
      }
      bits.push(bit)
    }

    var previous_xor = false
    for (var b = 0; b < bits.length; b++) {
      // Draw Bit
      var bit = bits[b]
      bit.box_el = g.append("rect")
        .attr("class", bit.class)
        .attr("x", bit.x)
        .attr("y", bit.y)
        .attr("width", bit.size)
        .attr("height", bit.size)
        .on("click", function () {
          this.value = (this.value + 1) % 2
          this.text_el.text(this.value)
        }.bind(bit))
      bit.text_el = g.append("text")
        .attr("class", bit.class)
        .attr("x", bit.cx)
        .attr("y", bit.cy)
        .attr("dy", 6)
        .attr("text-anchor", "middle")
        .text(bit.value)

      if (bit.xor) {
        if (!previous_xor) {
          g.append("polyline")
            .attr("class", "arrow")
            .attr("points", polyline_points([
              [bit.xor.cx, bit.xor.cy],
              [5, bit.xor.cy],
              [5, bits[0].cy],
              [bits[0].x - arrow_short, bits[0].cy]
            ]))
        } else {
          g.append("polyline")
            .attr("class", "arrow")
            .attr("points", polyline_points([
              [bit.xor.cx, bit.xor.cy],
              [previous_xor.cx + previous_xor.r + arrow_short, previous_xor.cy]
            ]))
        }

        g.append("polyline")
          .attr("class", "arrow")
          .attr("points", polyline_points([
            [bit.cx, bit.y + bit.size],
            [bit.xor.cx, bit.xor.cy - bit.xor.r - arrow_short]
          ]))

        g.append("circle")
          .attr("class", "xor")
          .attr("r", bit.xor.r)
          .attr("cx", bit.xor.cx)
          .attr("cy", bit.xor.cy)
        g.append("line")
          .attr("class", "xor")
          .attr("x1", bit.xor.cx - bit.xor.r)
          .attr("y1", bit.xor.cy)
          .attr("x2", bit.xor.cx + bit.xor.r)
          .attr("y2", bit.xor.cy)
        g.append("line")
          .attr("class", "xor")
          .attr("x1", bit.xor.cx)
          .attr("y1", bit.xor.cy - bit.xor.r)
          .attr("x2", bit.xor.cx)
          .attr("y2", bit.xor.cy + bit.xor.r)

        previous_xor = bit.xor
      }
    }

    /*for (var b = 0; b < bitwidth; b++) {
      // Arrow from bit to leftwards XOR.
      g.append("polyline")
        .attr("class", "arrow")
        .attr("points", polyline_points([
          [ui_bit_dimension * (1 + b + 0.5), 5 + ui_bit_dimension],
          [ui_bit_dimension * (1 + b + 0.5), 5 + ui_bit_dimension * 2],
          [ui_bit_dimension * (1 + b - 1 + 0.5) + ui_xor_radius, 5 + ui_bit_dimension * 2]
        ]))

      // Arrow from XOR to leftwards XOR.
      g.append("polyline")
        .attr("class", "arrow")
        .attr("points", polyline_points([
          //[ui_bit_dimension * (1 + b + 0.5), 5 + ui_bit_dimension],
          [ui_bit_dimension * (1 + b + 0.5), 5 + ui_bit_dimension * 2],
          [ui_bit_dimension * (1 + b - 1 + 0.5) + ui_xor_radius, 5 + ui_bit_dimension * 2]
        ]))

      // Tap arrow from bit to XOR.
      g.append("polyline")
        .attr("class", "arrow")
        .attr("points", polyline_points([
          [ui_bit_dimension * (1 + b + 0.5), 5 + ui_bit_dimension],
          [ui_bit_dimension * (1 + b + 0.5), 5 + ui_bit_dimension * 2 - ui_xor_radius - 2*arrowhead_dimension]
        ]))

      // Bit boxes
      g.append("rect")
        .attr("class", "bit")
        .attr("x", ui_bit_dimension + ui_bit_dimension * b)
        .attr("y", 5)
        .attr("width", ui_bit_dimension)
        .attr("height", ui_bit_dimension)
    }
    for (var b = 0; b < bitwidth; b++) {
      if (b + 1 < bitwidth) {
        // <circle cx="25" cy="25" r="25" fill="purple" />
        if (Math.random() > 0.4) {
          g.append("circle")
            .attr("class", "xor")
            .attr("r", ui_xor_radius)
            .attr("cx", ui_bit_dimension + ui_bit_dimension * (b + 0.5))
            .attr("cy", 5 + ui_bit_dimension * 2)
          g.append("line")
            .attr("class", "xor")
            .attr("x1", ui_bit_dimension + ui_bit_dimension * (b + 0.5) - ui_xor_radius)
            .attr("y1", 5 + ui_bit_dimension * 2)
            .attr("x2", ui_bit_dimension + ui_bit_dimension * (b + 0.5) + ui_xor_radius)
            .attr("y2", 5 + ui_bit_dimension * 2)
          g.append("line")
            .attr("class", "xor")
            .attr("x1", ui_bit_dimension + ui_bit_dimension * (b + 0.5))
            .attr("y1", 5 + ui_bit_dimension * 2 - ui_xor_radius)
            .attr("x2", ui_bit_dimension + ui_bit_dimension * (b + 0.5))
            .attr("y2", 5 + ui_bit_dimension * 2 + ui_xor_radius)
        }
      }
    }*/
  })
})

function polyline_points(points) {
  var points_str = ""
  for (i in points) {
    points_str += points[i].join(",") + " "
  }
  return points_str
}

/*
        var arr = [];
        arr.push(map.unproject([x1 , y1]));
        arr.push(map.unproject([x2 , y2]));
        var options ={color: 'green', weight: 3,opacity: 0.5, smoothFactor: 1 };
        var polyline = new L.Polyline(arr, options);



<polyline fill="none" stroke="blue" stroke-width="2"
 3    points="05,30
 4            15,30
 5            15,20
 6            25,20
 7            25,10
 8            35,10" />
*/
