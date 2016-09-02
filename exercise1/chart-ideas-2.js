var margin = { top: 50, right: 0, bottom: 100, left: 50 },
    width = 3560 - margin.left - margin.right,
    height = 830 - margin.top - margin.bottom,
    gridSize = Math.floor(1510 / 50),
    legendElementWidth = gridSize*2,
    buckets = 2,
    colors = ["#3c943d","#ff7f0e","#1f77b4"],
    days = [],
    times = [],
    datasets = ["numbers/a=259-m=65534-c=0-denary.txt", "numbers/a=361-m=450-c=1-denary.txt", "numbers/a=85-m=65536-c=1-denary.txt", "numbers/a=29305-m=58564-c=1-denary.txt"];

var bits = 3

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
      .attr("y", function (d, i) { return i * gridSize * 1; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize * 1.2; })
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
      .attr("x", function(d) { return (d.i) * gridSize * 1.2 })
      .attr("y", function(d) { return d.b * gridSize * 1 })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize * 1)
      .style("fill", function(d) { return d.value ? colors[d.b] : "white" })

    cards.enter().append("text")
      .attr("x", function(d) { return (d.i) * gridSize * 1.2 + gridSize / 2 })
      .attr("y", function(d) { return d.b * gridSize * 1 + gridSize / 2 })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "hour bordered")
      .text(function (d) { return d.value; })
      .style("text-anchor", "middle")

    cards.select("title").text(function(d) { return d.value })

    cards.exit().remove()
  })
};

heatmapChart(datasets[3]);

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
