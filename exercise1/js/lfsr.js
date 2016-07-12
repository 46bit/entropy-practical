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
        ui_bit_stroke = 4,
        ui_bit_color = "blue",
        ui_line_stroke = 4,
        ui_line_color = "purple",
        ui_xor_radius = 12,
        ui_xor_stroke = 3,
        ui_xor_color = "green"

    var bits = 8

    g.append("polyline")
      .attr("fill", "transparent")
      .attr("stroke", ui_line_color)
      .attr("stroke-width", ui_line_stroke)
      .attr("points", polyline_points([
        [ui_bit_dimension + ui_bit_dimension / 2, 5 + ui_bit_dimension * 3],
        [5, 5 + ui_bit_dimension * 3],
        [5, 5 + ui_bit_dimension / 2],
        [ui_bit_dimension, 5 + ui_bit_dimension / 2]
      ]))

    for (var b = 0; b < bits; b++) {
      g.append("polyline")
        .attr("fill", "transparent")
        .attr("stroke", ui_line_color)
        .attr("stroke-width", ui_line_stroke)
        .attr("points", polyline_points([
          [ui_bit_dimension + ui_bit_dimension * (b + 0.5), 5 + ui_bit_dimension],
          [ui_bit_dimension + ui_bit_dimension * (b + 0.5), 5 + ui_bit_dimension * 3],
          [ui_bit_dimension + ui_bit_dimension * (b - 1 + 0.5), 5 + ui_bit_dimension * 3]
        ]))

      // Bit boxes
      g.append("rect")
        .attr("fill", "transparent")
        .attr("stroke", ui_bit_color)
        .attr("stroke-width", ui_bit_stroke)
        .attr("x", ui_bit_dimension + ui_bit_dimension * b)
        .attr("y", 5)
        .attr("width", ui_bit_dimension)
        .attr("height", ui_bit_dimension)
    }
    for (var b = 0; b < bits; b++) {
      if (b + 1 < bits) {
        // <circle cx="25" cy="25" r="25" fill="purple" />
        g.append("circle")
          .attr("fill", "white")
          .attr("stroke", ui_xor_color)
          .attr("stroke-width", ui_xor_stroke)
          .attr("r", ui_xor_radius)
          .attr("cx", ui_bit_dimension + ui_bit_dimension * (b + 0.5))
          .attr("cy", 5 + ui_bit_dimension * 3)
        g.append("line")
          .attr("stroke", ui_xor_color)
          .attr("stroke-width", ui_xor_stroke)
          .attr("x1", ui_bit_dimension + ui_bit_dimension * (b + 0.5) - ui_xor_radius)
          .attr("y1", 5 + ui_bit_dimension * 3)
          .attr("x2", ui_bit_dimension + ui_bit_dimension * (b + 0.5) + ui_xor_radius)
          .attr("y2", 5 + ui_bit_dimension * 3)
        g.append("line")
          .attr("stroke", ui_xor_color)
          .attr("stroke-width", ui_xor_stroke)
          .attr("x1", ui_bit_dimension + ui_bit_dimension * (b + 0.5))
          .attr("y1", 5 + ui_bit_dimension * 3 - ui_xor_radius)
          .attr("x2", ui_bit_dimension + ui_bit_dimension * (b + 0.5))
          .attr("y2", 5 + ui_bit_dimension * 3 + ui_xor_radius)
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
