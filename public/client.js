/* global d3 Pikaday */ // This line makes JSLint not complain

// client-side js
// run by the browser each time your view template is loaded

//var d3 = require('d3');

// by default, you've got jQuery,
// add other scripts at the bottom of index.html


$(function() {  
  
function graphSteps(jsonURL,colabel) {
  var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 1500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  var y2 = d3.scaleLinear().range([height,0]);
  
  var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat("%m-%d"));
  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);
  var yAxisRight = d3.axisRight()
    .scale(y2)
    .ticks(10);
  var color = d3.scaleOrdinal()
    .range(colabel.colors);
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
var svg = d3.select("main").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.json(jsonURL, function(error, data) {
	
  var names = colabel.labels;
  color.domain(names);
  
  data.forEach(function(d) {
    var y0 = 0;
    d.mapping = Object.keys(names).map(function(name) {
      return {
        name: name,
        label: names[name],
        y0: 0,
        y1: d[name],
        date: d3.isoParse(d.date)
      }
      
    })
    d.total = d.steps;
  })
  
  x.domain(data.map(function(d) { return d3.isoParse(d.date); }));
  y.domain([0, d3.max(data, function(d) { 
    return d3.max(Object.keys(names).map(function(name){ return d[name]; })); 
  })]);
  y2.domain([0, d3.max(data, function(d) { return d.temp; })]);
  // create a line function that can convert data[] into x and y points
/*
  var line1 = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) { 
				// verbose logging to show what's actually being done
				console.log('Plotting X1 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
				// return the X coordinate where we want to plot this datapoint
			return x(i); 
		})
		.y(function(d) { 
				// verbose logging to show what's actually being done
				console.log('Plotting Y1 value for data point: ' + d + ' to be at: ' + y2(d) + " using our y1Scale.");
				// return the Y coordinate where we want to plot this datapoint
			return y2(d); 
		})
    */
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
    
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  /*
  svg.append("g")
    .attr("class", "y axis axisRight")
    .attr("transform", "translate("+ width + ",0)")
    .call(yAxisRight);

*/

  var series = svg.selectAll(".series")
    .data(data)
  .enter().append("g")
    .attr("class", "series")
    .attr("transform", function(d) {
      return "translate(" + x(d3.isoParse(d.date)) + ",0)";
    });
  
  /*
  svg.selectAll(".series")
    .data(data)
  .enter().append("circle")
    .attr("class","dot")
    .attr("cx", function(d) {return x(d3.isoParse(d.date));})
    .attr("cy", function(d) {return y2(d.temp);})
    .attr("r", 4)
    .style("fill", "black");
  
*/
  
  //console.log(series)
  series.selectAll("rect")
    .data(function(d) { return d.mapping; })
  .enter().append("rect")
    .attr("width", x.bandwidth())
    .attr("y", function (d) { return y(d.y1); })
    .attr("height", function (d) { return y(d.y0) - y(d.y1); })
    .style("fill", function (d) { return color(d.name); })
    .on("mouseover", function(d) { 
      div.transition()
        .duration(100)
        .style("opacity", 0.9);
      div.html(d3.timeFormat('%a %m-%d')(d.date) + ": " + d.y1)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");
    })
    .on("mouseout",  function(d) {
      div.transition()
        .duration(100)
        .style("opacity",0);
    })
  
  
  /* ***** LEGEND ***** */
  
  var legend = svg.selectAll(".legend")
    .data(Object.values(names).slice())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d,i) {
      return "translate(0," + i * 20 + ")";
    });
  
  legend.append("rect")
    .attr("x", width - 10)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", color);
  
  legend.append("text")
    .attr("x", width - 12)
    .attr("y", 6)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d === "steps" ? "total" : d; });
  
  
  
  
});
  
  return svg;
}
  
  graphSteps("steps.json", {
    colors: ['#FEFBAF','#FFE545','#026475'],
    labels: {steps: "Total", schoolday: "School day", recess: "Recess"}
  });
  
  graphSteps("steps.json", {
    colors: ["#F2FF8C", "#3187F7"],
    labels: {schoolday: "School day", recess: "Recess"}
  });
  
  var svg = graphSteps("steps.json", {
    colors: ['#3187F7'],
    labels: {recess: "Recess"}
  });
  
  
});