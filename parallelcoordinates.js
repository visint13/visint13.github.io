// SVG
var svg = d3.select("#visualization").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top /0.5 + ")");

// Get Data
  d3.csv("data/pilot3/pc_cars_100_g1.csv", function(data) {
  // d3.csv("<%= '#{root_path}/intuitive/show.csv' %>", function(data) {
  dataset = data;

  // Number of dimensions
  var numDimension = d3.keys(dataset[0]).length - 2;

  // Get dimensions names
  var key = d3.keys(dataset[0]);
  // console.log(key); 

  var yScaling;
  var axis;
  var padding;
  var yScalingArray = new Array(numDimension);
  var subData = [];
  var line = d3.svg.line()
    .x(function(d, i) {
      return i * (width / (numDimension - 1));
    })
    .y(function(d, i) {
      return yScalingArray[i](+d);
    });
  var path;
  var legend;
  var dataLabel;
  var dataLabelArray = [];
  var label;
  var labelArray = [];

  // Get ID (ID = Group)
  var names = [];
  dataset.forEach(function(d) {
    names.push(d[key[0]]);
  });
  var id = d3.unique(names);
  // console.log(id);

  // Color for Group
  // var color = d3.scale.category10()
  //   .domain(id);

  // Scaling
  var j;
  var k;
  for (j = 0; j < numDimension; j++) {
    yScalingArray[j] = d3.scale.linear()
      .domain([d3.min(dataset, function(d, i) {
        return +d[key[j + 2]];
      }), d3.max(dataset, function(d, i) {
        return +d[key[j + 2]];
      })])
      .range([height, 0]);
  }


  for (k = 0; k < dataset.length; k++) {
    for (j = 0; j < numDimension; j++) {
      subData.push(dataset[k][key[j + 2]]);
    }

    // Data Label
    dataLabel = svg.selectAll(".text").data(subData).enter()
      .append("text")
      .attr("x", function(d, i) {
        return i * (width / (numDimension - 1)) - 20;
      })
      .attr("y", function(d, i) {
        return yScalingArray[i](+d) + 15;
      })
      .text(function(d, i) {
        return d;
      })
      .style("text-anchor", "middle")
      .style("visibility", "hidden");

    dataLabelArray.push(dataLabel);


    // Label
    label = svg.append("svg:text")
      .attr("id", k)
      .attr("x", -30)
      // .attr("x", (numDimension - 1) * (width / (numDimension - 1)) + 50)
      .attr("y", function(d, i) {
        return yScalingArray[i](+subData[0]) + 5;
      })
      .attr("dy", 0)
      .style("text-anchor", "left")
      .style("fill", "Black")
      .style("visibility", "hidden")
      .text(dataset[k][key[1]]);
      console.log(subData[0]);

    labelArray.push(label);


    // Line
    path = svg.append("svg:path")
      .attr("d", line(subData))
      .attr("id", k)
      .attr("fill", "none")
      .attr("stroke", color(dataset[k][key[0]]))
      .attr("stroke-width", 1)
      .attr("opacity", 0.5)
      .attr("class", "hoveringeffect")
      .on("mouseover", function() {
        // console.log(d3.select(this)[0][0]);
        var id = d3.select(this)[0][0].id;
        // for (var m = 0; m < dataLabelArray[id][0].length; m++) {
        //   d3.select(dataLabelArray[id][0][m]).style("visibility", "visible");
        // }
        d3.select(labelArray[id][0][0]).style("visibility", "visible");
        d3.select(this).attr("stroke-width", 4);
        d3.select(this).attr("opacity", 1.0);
        start_time = +new Date();
      })
      .on("mouseout", function() {
        var id = d3.select(this)[0][0].id;
        // for (var m = 0; m < dataLabelArray[id][0].length; m++) {
        //   d3.select(dataLabelArray[id][0][m]).style("visibility", "hidden");
        // }
        d3.select(labelArray[id][0][0]).style("visibility", "hidden");
        d3.select(this).attr("stroke-width", 1);
        d3.select(this).attr("opacity", 0.5);

        hovered_label = d3.select(labelArray[id][0][0]).text();
        
        end_time = +new Date();
        timespent = end_time - start_time;
        temp_json = {"happen_at": end_time.toLocaleString(), "event_type": "mouseover", "description": "{" + "target:" + d3.select(this) + ",name:" + hovered_label + ",timespent:" + timespent +"}"};
        event_array.push(temp_json);
        record_hover(event_array, 100);
      });

    subData = [];

  }

   svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height / -5.5))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px")
    .text("Car Models from 2002 to 2012");

  // Axis
  for (j = 0; j < numDimension; j++) {
    axis = d3.svg.axis()
      .scale(yScalingArray[j])
      .orient("right")
      .ticks(5)
    // .tickValues(yScalingArray[j].domain())
    ;

    padding = j * (width / (numDimension - 1));

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(axis)
      .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -17)
      .text(key[j + 2]);
  }

  // Legend
  legend = svg.selectAll(".legend")
    .data(id).enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(" + margin.left + "," + i * 20 + ")";
    })
    .style("fill", function(d, i) {
      return color(id[i]);
    })
    .attr("opacity", 0.7);

  legend.append("rect")
    .attr("x", width + 10)
    .attr("width", 7)
    .attr("height", 7);

  legend.append("text")
    .attr("x", width + 10)
    .attr("y", 5)
    .attr("dx", 10)
    .attr("dy", 2)
    .style("text-anchor", "left")
    .style("fill", "Black")
    .text(function(d) {
      return d;
    });

});
