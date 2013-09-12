//Variables
var hist = [];
var binNum = 5; //number of bins in the graph
var colNum = 5; //column in the data for the graph

//SVG
var svg = d3.select("#visualization").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//CSV
d3.csv("data/pilot3/histogram_cars_30_g1.csv", function(data) {
// d3.csv("<%= '#{root_path}/intuitive/show.csv' %>", function(data) {
	dataset = data;
	var key = d3.keys(dataset[0]);

	var map = data.map(function(d) {
		return +d[key[colNum]];
	});

	//Scale
	var xScale = d3.scale.linear()
		.domain(d3.extent(map))
		.range([0, width]);

	//Histogram array
	hist = d3.layout.histogram()
		// .bins(binNum)
		.bins(xScale.ticks(binNum))
	(map);

	var yScale = d3.scale.linear()
		.domain([0, Math.ceil(d3.max(hist.map(function(i) {
			return i.length;
		})))*1.1])
		.range([height, 0]);

	// //Histogram array
	// hist = d3.layout.histogram()
	// 	// .bins(binNum)
	// 	.bins(xScale.ticks(binNum))
	// (map);
	// // console.log(hist);

	var bars = svg.selectAll(".bar")
		.data(hist)
		.enter()
		.append("g");

	// //Scale
	// var xScale = d3.scale.linear()
	// 	.domain(d3.extent(map))
	// 	.range([0, width]);

	// var yScale = d3.scale.linear()
	// 	.domain([0, Math.ceil(d3.max(hist.map(function(i) {
	// 		return i.length;
	// 	})))*1.1])
	// 	.range([height, 0]);

	//Axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickValues(xScale.ticks(binNum))
		;

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(3);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis)
		.append("text")
		.attr("transform", "translate(" + width / 2 + "," + height / 8 + ")")
		.style("text-anchor", "middle")
		.text(key[colNum]);

	svg.append("g")
		.attr("class", "axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "translate(" + (-margin.left) / 1.3 + "," + height / 2 + ") rotate(-90)")
		.attr("text-anchor", "middle")
		.text("Frequency (Number of Cars)");
 
 svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height / -20))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px")
    .text("Number of Cars by Weight");

	//histogram
	bars.append("rect")
		.attr("x", function(d) {
			return xScale(d.x); 
		})
		.attr("y", function(d) {
			return yScale(d.y);
		})
		.attr("width", function(d) {
			return xScale(hist[1].x) - xScale(hist[0].x);
		})
		.attr("height", function(d) {
			return height - yScale(d.y);
		})
		.attr("fill", function(d){
			return color(d[key[0]]);
		})
		.attr("opacity", 0.7)
		.attr("stroke-width", 1)
		.attr("stroke", "white")
		.on("mouseover", function(d, i) {
			// d3.select(labels[0][i]).style("visibility", "visible");
			start_time = +new Date();
		})
		.on("mouseout", function(d, i) {
			// d3.select(labels[0][i]).style("visibility", "hidden");

			hovered_label = d3.select(x_bins_label[0][i]).text();

      end_time = +new Date();
      timespent = end_time - start_time;
      temp_json = {"happen_at": end_time.toLocaleString(), "event_type": "mouseover", "description": "{" + "target:" + d3.select(this) + ",name:" + hovered_label + ",timespent:" + timespent +"}"};
      event_array.push(temp_json);
      record_hover(event_array, 100);
		});


	//Label
	labels = svg.selectAll(".label")
		.data(hist)
		.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("x", function(d) {
			return xScale(d.x + d.dx / 2);
		})
		.attr("y", function(d) {
			return yScale(d.y) - 5;
		})
		.style("visibility", "hidden")
		.text(function(d) {
			return d.length;
		});

		//Label
	x_bins_label = svg.selectAll(".label")
		.data(hist)
		.enter()
		.append("text")
		.style("visibility", "hidden")
		.text(function(d, i) {
			return d.x;
		});	

	// // Legend
	// var legend = svg.selectAll(".legend")
	//	.data(hist)
	//	.enter().append("g")
	//	.attr("class", "legend")
	//	.attr("transform", function(d, i) {
	//		return "translate(" + margin.left + "," + i * 20 + ")";
	//	})
	//	.style("fill", function(d) {
	//		return color(d);
	//	});

	// legend.append("rect")
	//	.attr("x", width)
	//	.attr("width", 7)
	//	.attr("height", 7);

	// legend.append("text")
	//	.attr("x", width)
	//	.attr("y", 5)
	//	.attr("dx", "1em")
	//	.attr("dy", "0.2em")
	//	.style("text-anchor", "left")
	//	.style("fill", "Black")
	//	.text(function(d) {
	//		return d.x.toFixed(1) + " ~ " + (d.x + d.dx).toFixed(1);
	//	});

});