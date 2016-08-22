var margin = { top: 50, right: 0, bottom: 100, left: 50 },
    width = 3560 - margin.left - margin.right,
    height = 830 - margin.top - margin.bottom,
    gridSize = Math.floor(1510 / 72),
    legendElementWidth = gridSize*2,
    buckets = 2,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = [],
    times = [],
    datasets = ["numbers/a=85-m=65536-c=1-denary.txt", "numbers/65536-qrng.txt", "data2.tsv"];

var bits = 8

for (var i = 0; i < bits; i++) {
  days.push("bit" + i)
}

for (var i = 0; i < 160; i++) {
  times.push("" + i)
}

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize * 2; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return "timeLabel mono axis axis-worktime"; });

var heatmapChart = function(tsvFile) {
  d3.text(tsvFile, "text/plain", function(txt) {
    // Split up file into lines.
    var data_strs = txt.split("\n")
    // Trim all whitespace from lines.
    data_strs = _.map(data_strs, function (datum_str) {
      return datum_str.replace(/ /g, '')
    })
    // Only keep non-empty lines.
    data_strs = _.take(_.filter(data_strs, function (datum_str) {
      return datum_str.length > 0
    }), 300)

    var data = []
    for (var i = 0; i < data_strs.length; i++) {
      var datum = parseInt(data_strs[i])

      for (var b = 0; b < bits; b++) {
        data.push({
          "i": i,
          "b": b,
          "value": datum & 1
        })
        datum = datum >> 1
      }
    }
    console.log(data)

    var colorScale = d3.scale.category10()

    var cards = svg.selectAll(".hour")
      .data(data, function(d) { return JSON.stringify(d) })

    cards.append("title")

    cards.enter().append("rect")
      .attr("x", function(d) { return (d.i) * gridSize })
      .attr("y", function(d) { return (bits - 1 - d.b) * gridSize * 2 })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize * 1)
      .style("fill", colors[0])

    cards.transition().duration(1000)
      //.style("fill", function(d) { return colorScale(d.b) })
      //.style("fill", function(d) { return colorScale(d.b % 10) })// d.value ? colorScale(d.b % 10) : "white" })
      //.style("opacity", function(d) { return Math.max(d.value, 0.1) })
      .style("fill", function(d) { return d.value ? colorScale(d.b % 10) : "white" })
      .style("fill", function(d) { return d.value ? "black" : "white" })
      //.style("opacity", function(d) { return Math.max(d.value, 0.1) })

    cards.select("title").text(function(d) { return d.value })

    cards.exit().remove()
  })

  /*cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });

    cards.exit().remove();

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize);

    legend.exit().remove();

  }(null, [[]]) //);*/
};

heatmapChart(datasets[0]);

var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
  .data(datasets);

datasetpicker.enter()
  .append("input")
  .attr("value", function(d){ return "Dataset " + d })
  .attr("type", "button")
  .attr("class", "dataset-button")
  .on("click", function(d) {
    heatmapChart(d);
  });
