// SVG
var svg = d3.select("#visualization").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top / 0.5 + ")");

var numDimension;
var angle;
var axesNames;
var key;
var yScaling;
var axis;
var yScalingArray = new Array(numDimension);
var subData = [];
var lineR;
var dot;
var path;
var legend;
var dataLabel;
var dataLabelArray = [];
var label;
var labelArray = [];

// Get Data
d3.csv("data/pilot3/radial_cars_5_g1.csv", function(data) {
// d3.csv("<%= '#{root_path}/intuitive/show.csv' %>", function(data) {
  dataset = data;

  // Number of dimensions
  numDimension = d3.keys(dataset[0]).length - 2;

  // Get dimensions names
  key = d3.keys(dataset[0]);

  axesNames = key.slice(2, key.length);

  lineR = d3.svg.line()
    .x(function(d, i) {
      if (i === 2) {
        x = 0;
        y = yScalingArray[i](+d);
        // xNew = Math.cos(angle(axesNames[i])) * x + (-1) * Math.sin(angle(axesNames[i])) * y;
        return x + width / 2;
      }
      else {
        x = 0;
        y = yScalingArray[i](+d);
        xNew = Math.cos(angle(axesNames[i])) * x + (-1) * Math.sin(angle(axesNames[i])) * y;
        return xNew + width / 2;
      }
    })
    .y(function(d, i) {
      if (i === 2) {
        x = 0;
        y = yScalingArray[i](+d);
        // yNew = Math.sin(angle(axesNames[i])) * x + Math.cos(angle(axesNames[i])) * y;
        return  y;
      }
      else {
        x = 0;
        y = yScalingArray[i](+d);
        yNew = Math.sin(angle(axesNames[i])) * x + Math.cos(angle(axesNames[i])) * y;
        // console.log(i + ": " + yNew + "," + (height / 2 + yNew));
        return yNew + height / 2;
      }
    });

  // Get ID (ID = Group)
  var names = [];
  dataset.forEach(function(d) {
    names.push(d[key[0]]);
  });
  var id = d3.unique(names);
  // console.log(id);

  // Color for Group
  // var color_p = d3.scale.category10()
  //   .domain(id);

  // Scaling
  var j;
  var k;
  //TODO: The third axis is manually coded to rotate.
  for (j = 0; j < numDimension; j++) {
    if (j === 2) {
      yScalingArray[j] = d3.scale.linear()
      .domain([d3.max(dataset, function(d, i) {
        return +d[key[j + 2]]; // Polygon with minimum values is shown as a point. So we multiply 0.9 to minimum value.  
      }), d3.min(dataset, function(d, i) {
        return +d[key[j + 2]]*0.9;
      })])
      .range([0, height / 2]);
    }
    else {
      yScalingArray[j] = d3.scale.linear()
      .domain([d3.min(dataset, function(d, i) {
        return +d[key[j + 2]]*0.9; // Polygon with minimum values is shown as a point. So we multiply 0.9 to minimum value.  
      }), d3.max(dataset, function(d, i) {
        return +d[key[j + 2]];
      })])
      .range([0, height / 2]);
    }

  }

  yScalingArray.push(yScalingArray[0]);

  //    
  axesNames.push("dummy"); //so the first and last will not overlap

  var radius = d3.scale.linear()
    .domain([0, 1])
    .range([height / 3, height / 2]);

  angle = d3.scale.ordinal()
    .domain(axesNames)
    .rangePoints([0, 2 * Math.PI]);

  for (k = 0; k < dataset.length; k++) {
    for (j = 0; j < numDimension; j++) {
      subData.push(dataset[k][key[j + 2]]);
    }

    // console.log(k);
    var subData2 = subData.slice(0);
    subData2.push(dataset[k][key[0 + 2]]);

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
      .attr("x", width - margin.left)
      .attr("y", height / 8)
      .attr("dy", 17)
      .style("text-anchor", "left")
      .style("fill", "Black")
      .style("visibility", "hidden")
      .text(dataset[k][key[1]]);

    labelArray.push(label);

    // // Dot
    // dot = svg.selectAll(".dot")
    //   .data(subData).enter()
    //   .append("circle")
    //   .attr("cx", function(d, i) {
    //     return 0 * (width / (numDimension - 1));
    //   })
    //   .attr("cy", function(d, i) {
    //     return yScalingArray[i](+d);
    //   })
    //   .attr("r", 3)
    //   .attr("transform", function(d, i) {
    //     return "translate(" + width / 2 + "," + height / 2 + ") rotate(" + angle(axesNames[i]) * 180 / Math.PI + ")";
    //   })
    //   .attr("fill", color_p(dataset[k][key[0]]))
    //   .attr("stroke", color_p(dataset[k][key[0]]))
    //   .attr("stroke-width", 0)
    //   .attr("opacity", 0.8);


    // Line
    path = svg.append("svg:path")
      .attr("d", lineR(subData2))
      .attr("id", k)
      .attr("fill", "none")
      .attr("stroke", color(dataset[k][key[0]]))
      .attr("stroke-width", 1)
      .attr("opacity", 0.7)
      .on("mouseover", function() {
        // console.log(d3.select(this)[0][0]);
        var id = d3.select(this)[0][0].id;
        // for (var m = 0; m < dataLabelArray[id][0].length; m++) {
        //   d3.select(dataLabelArray[id][0][m]).style("visibility", "visible");
        // }
        d3.select(labelArray[id][0][0]).style("visibility", "visible");
        d3.select(this).attr("stroke-width", 3);
        start_time = +new Date();
      })
        .on("mouseout", function() {
        var id = d3.select(this)[0][0].id;
        // for (var m = 0; m < dataLabelArray[id][0].length; m++) {
        //   d3.select(dataLabelArray[id][0][m]).style("visibility", "hidden");
        // }
        d3.select(labelArray[id][0][0]).style("visibility", "hidden");
        d3.select(this).attr("stroke-width", 1);

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
    .text("Car Models in 2011");

  // Axis
  for (j = 0; j < numDimension; j++) {
    if (j === 2){
      axis = d3.svg.axis()
        .scale(yScalingArray[j])
        .orient("left")
        .ticks(5)
        ;
    }
    else{
        axis = d3.svg.axis()
        .scale(yScalingArray[j])
        .orient("right")
        .ticks(5)
        ;
    }
    // axis = d3.svg.axis()
    //   .scale(yScalingArray[j])
    //   .orient("right")
    //   .ticks(5)
    // // .tickValues(yScalingArray[j].domain())
    // ;

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", function(d) {
        if (j === 2){
          return "translate(" + width / 2 + ") ";
        }
        else {
          return "translate(" + width / 2 + "," + height / 2 + ") rotate(" + angle(axesNames[j]) * 180 / Math.PI + ")";
        } 
      })
      .call(axis)
      .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", function(d) {
        if (j === 2) {
         return -8;
        }
        else {
          return height / 2 + 17;
        }
      })
      .text(key[j + 2])
      ;
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
    .attr("x", width - 100)
    .attr("width", 7)
    .attr("height", 7);

  legend.append("text")
    .attr("x", width - 100)
    .attr("y", 5)
    .attr("dx", 10)
    .attr("dy", 2)
    .style("text-anchor", "left")
    .style("fill", "Black")
    .text(function(d) {
    return d;
  });

});