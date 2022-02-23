const prosentConverter = (threshold, shoot) => {
    const increase = shoot - threshold
    return parseInt(increase / shoot * 100)
  }
  const prosentConverter2 = (threshold, shoot) => {
    const decrease = threshold - shoot
    return parseInt(decrease / shoot * 100)
  }

  
  const getScale =(threshold, shoot) => {
    if(threshold > shoot){
      return prosentConverter2(threshold, shoot)
    }else{
      return prosentConverter(threshold, shoot)
    }
  }


const data = [
    {id: 1, pb: "climate change", threshhold: -2.35, shoot: 18.95, scale: getScale(-2.35, 18.95)},
    {id: 1, pb: "Ocean acidification", threshhold: -1.59, shoot: 15.33, scale: getScale(-1.59, 15.33)},
    {id: 1, pb: "Nitrogen", threshhold: 100, shoot: 72.7, scale: getScale(100, 72.7)},
    {id: 1, pb: "Phosphorus", threshhold: 1.1, shoot: 4, scale: getScale(1.1, 4)},
    {id: 1, pb: "Biodiversity", threshhold: 0.6, shoot: 0.45, scale: getScale(0.6, 0.45)},
  
];

console.log(data.map(d => "Planetery boundary: " + d.pb + " Scale: " + d.scale));


// set the dimensions and margins of the graph
const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    innerRadius = 100,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg = d3.select("#dataWiz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

  // Scales
  const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(d => d.scale)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, d3.max(data.map(d => d.scale))]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", "#69b3a2")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d['scale']))
          .startAngle(d => x(d.scale))
          .endAngle(d => x(d.scale) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("text-anchor", function(d) { return (x(d.pb) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.scale) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(120)) + ",0)"; })
      .append("text")
        .text(function(d){return(d.pb)})
        .attr("transform", function(d) { return (x(d.pb) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle");


// Add the ring axis
svg.append('g')
    .attr("text-anchor", "middle")
    .call(g => g.append("text")
        .attr("y", d => -y(y.ticks(5).pop()))
        .attr("dy", "-1em"))
    .call(g => g.selectAll("g")
      .data(y.ticks(5).slice(1))
      .enter().append("g")
        .attr("fill", "none")
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", .2)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .text(y.tickFormat(5, "s"))
         .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")));

// Data for the ring
const dataRing = [20];

// Y axis for the inner circle
const ybis = d3.scaleRadial()
      .range([innerRadius, 80])   // Domain will be defined later.
      .domain([0, 20]);

// Bars for the inner circle
svg.append("g")
    .selectAll("path")
    .data(dataRing)
    .join("path")
      .attr("fill", "green")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(d => ybis(0))
          .outerRadius(d => ybis(d))
          .startAngle(10)
          .endAngle(x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius));