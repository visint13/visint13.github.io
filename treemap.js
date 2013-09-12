
        var treemap = d3.layout.treemap()
    			.size([width, height])
    			.sticky(true)
    			.value(function(d) { return d.size; });

				var div = d3.select("body").append("div")
				    .style("position", "relative")
				    .style("width", (width + margin.left + margin.right) + "px")
				    .style("height", (height + margin.top + margin.bottom) + "px")
				    .style("left", margin.left + "px")
				    .style("top", margin.top + "px");

				d3.json("data/treemap.json", function(error, root) {
				  var node = div.datum(root).selectAll(".node")
				      .data(treemap.nodes)
				    .enter().append("div")
				      .attr("class", "node")
				      .call(position)
				      .style("background", function(d) { return d.children ? color(d.name) : null; })
				      .text(function(d) { 
				      	return d.name; //return d.children ? null : d.name; 
				      })
				      .on("mouseover", function(d) { 
								showToolTip(" "+ d.name +"<br/>" + d.size,  d.x+d3.mouse(this)[0]+50, d.y+d3.mouse(this)[1],true);
				      })
				      .on("mousemove", function(d) {
									tooltipDivID.css({top:d.y+d3.mouse(this)[1],left:d.x+d3.mouse(this)[0]+50});
							})
							.on("mouseout", function(d) {
									showToolTip(" ",0,0,false);
							});
				      ;

					  d3.selectAll("input").on("change", function change() {
					    var value = this.value === "count"
					        ? function() { return 1; }
					        : function(d) { return d.size; };

	    			node.data(treemap.value(value).nodes)
	        		.call(position);
	  				});

				});

				function showToolTip(pMessage,pX,pY,pShow)
				{
				  if (typeof(tooltipDivID)=="undefined")
				  {
            tooltipDivID =$("<div id= 'tooltip' ></div>");

						$("body").append(tooltipDivID);
				  }
				  if (!pShow) { tooltipDivID.hide(); return;}
				  //MT.tooltipDivID.empty().append(pMessage);
				  tooltipDivID.html(pMessage);
				  tooltipDivID.css({top:pY,left:pX});
				  tooltipDivID.show();
				}

				function position() {
				  this.style("left", function(d) { return d.x + "px"; })
				      .style("top", function(d) { return d.y + "px"; })
				      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
				      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
				}
        