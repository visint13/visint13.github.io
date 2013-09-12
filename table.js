d3.csv("data/pilot3/filter_cars_g1.csv", function(data) {
// d3.csv("<%= '#{root_path}/intuitive/show.csv' %>", function(dataTemp) {
  // the columns you'd like to display
  keys = d3.keys(data[0]);
  // console.log(keys);
  // var columns = [keys[0], keys[1], keys[2], keys[3], keys[4], keys[5]];
  var columns = [keys[0], keys[1], keys[2]];

  d3.select("#visualization").append("text")
    .attr("x", (width / 20))             
    .attr("y", (height / -1.7))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px")
    .text("Cars for Brand A")
    ;

  var div = d3.select("#visualization").append("div")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var table = div.append("table")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("style", "margin-left: 10px")
    .attr("style", "text-align: center")
    .style("border-collapse", "collapse")

  .style("border", "3px black solid"),
    thead = table.append("thead"),
    tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(column) {
      return column;
    });

  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
    .data(function(row) {
      return columns.map(function(column) {
        return {
          column: column,
          value: row[column]
        };
      });
    })
    .enter()
    .append("td")
    .text(function(d) {
      return d.value;
    });
});