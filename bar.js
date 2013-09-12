var label_padding_x = 15;
var label_padding_y = 8;

var x0 = d3.scale.ordinal()
  .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x0)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5);

var svg = d3.select("#visualization").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataset = [];

d3.csv("data/pilot3/bar_cars_10_g1.csv", function(dataTemp) {
// d3.csv("<%= '#{root_path}/intuitive/show.csv' %>", function(dataTemp) {

  var data = dataTemp;
  var keys = d3.keys(data[0]);
  var x_label = keys[1];

  // Get uniques values
  var groupsall = [];
  var typesall = [];
  data.forEach(function(d) {
    groupsall.push(d[keys[0]]);
    typesall.push(d[keys[1]]);
  });

  types = d3.unique(typesall);
  groups = d3.unique(groupsall);


  // Reorganize the dataset to a certain object structure
  var object = new Object();
  var numberValues = [];

  types.forEach(function(name, i) {
    // console.log(name + "," + i);
    object = {
      CarName: name
    }; //TODO: Fix this as below!!
    // object[keys[1]] = name;

    object["numberValues"] = [];

    data.forEach(function(d) {
      if (d[keys[1]] == name) {
        var o = {
          name: d[keys[1]],
          value: +d[keys[2]]
        };
        object.numberValues.push(o);
      }
    });

    dataset.push(object);
  });

  data = dataset;

  // console.log(data);


  x0.domain(data.map(function(d) {
    return d[keys[1]];
  }));

  x1.domain(groups).rangeRoundBands([0, x0.rangeBand()]);

  y.domain([0, d3.max(data, function(d) {
      return d3.max(d.numberValues, function(d) {
        return d.value;
      });
    })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  // This part is for if you have long labels on ticks.
  .selectAll("text")
  .style("text-anchor", "end")
      .attr("dx", ".5em")
      // .attr("dy", "-.15em")
      // .attr("transform", function(d) {
      //     return "rotate(-45)" 
      //     })
      ;

    svg.append("text")
    .attr("transform", "translate(" + width / 2 + "," + height / 0.84 + ")")
    .style("text-anchor", "middle")
    .text(x_label);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "translate(" + (-margin.left) / 1.3 + "," + height / 2 + ") rotate(-90)")
    .style("text-anchor", "middle")
    .text(keys[2]);

  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height / -15))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px")
    .text("Price by Car Name");

  var barInput = svg.selectAll(".barInput")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
      return "translate(" + x0(d[x_label]) + ",0)";
    });

  barInput.selectAll("rect")
    .data(function(d) {
      return d.numberValues;
    })
    .enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function(d) {
      return x1(d.name);
    })
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .attr("opacity", 0.7)
    .style("fill", function(d) {
      return color(d[keys[0]]);
    })
    .on("mouseover", function(d) {
      // console.log(d.name);
      // group = d3.select(this).node().parentNode;
      // group_transform = get_translate_matrix(group);
      // group2 = d3.select(group).node().parentNode;
      // group_transform2 = get_translate_matrix(group2);
      // showToolTip(" " + d.value, 
      //   group_transform[0] + group_transform2[0] + x1(d.name) + (x1.rangeBand() / 2),
      //    group_transform2[1] + y(d.value) - label_padding_y, 
      //    true);
      start_time = +new Date();
    })
    .on("mouseout", function(d) {
      // showToolTip(" ", 0, 0, false);

      hovered_label = d.name;

      end_time = +new Date();
      timespent = end_time - start_time;
      temp_json = {"happen_at": end_time.toLocaleString(), "event_type": "mouseover", "description": "{" + "target:" + d3.select(this) + ",name:" + hovered_label + ",timespent:" + timespent +"}"};
      event_array.push(temp_json);
      record_hover(event_array, 100);
    });

  var legend = svg.selectAll(".legend")
    .data(groups)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(" + margin.left + "," + i * 20 + ")";
    })
    .attr("opacity", 0.7)
    .style("fill", function(d) {
      return color(d[keys[0]]);
    });


  legend.append("rect")
    .attr("x", width - 15)
    .attr("width", 7)
    .attr("height", 7);

  legend.append("text")
    .attr("x", width - 15)
    .attr("y", 5)
    .attr("dx", 10)
    .attr("dy", 2)
    .style("text-anchor", "left")
    .style("fill", "Black")
    .text(function(d) {
      return d;
    });

});

function showToolTip(pMessage, pX, pY, pShow) {
  if (typeof(tooltipDivID) == "undefined") {
    tooltipDivID = $("<div id= 'barLabel' ></div>");
    $("body").append(tooltipDivID);
  }
  if (!pShow) {
    tooltipDivID.hide();
    return;
  }
  //MT.tooltipDivID.empty().append(pMessage);
  tooltipDivID.html(pMessage);
  tooltipDivID.css({
    top: pY,
    left: pX
  });
  tooltipDivID.show();
}