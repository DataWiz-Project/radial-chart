
const prosentConverter = (threshold, shoot) => {
    const increase = shoot - threshold
    return parseInt(increase / shoot * 100)
  }
  const prosentConverter2 = (threshold, shoot) => {
    const decrease = threshold - shoot
    return parseInt(decrease / shoot * 100)
  }


// const prosentConverter = (threshold, shoot) => {
//     return (threshold / shoot) * 100
//   }
//   const prosentConverter2 = (threshold, shoot) => {
//     return (shoot / threshold) * 100
//   }
  
  const getScale =(threshold, shoot) => {
    if(threshold > shoot){
      return prosentConverter2(threshold, shoot)
    }else{
      return prosentConverter(threshold, shoot)
    }
  }

//   const getNewScale = (threshold, shoot) => {
//     if(threshold < shoot){
//         return 100 * (shoot - (threshold) / threshold)
//     }else{
//         return 100 * (threshold - (shoot) / shoot)
//     }
//   }

const data = [
    {id: 1, pb: "climate change", threshhold: -2.35, shoot: 18.95, scale: getScale(-2.35, 18.95)},
    {id: 1, pb: "Ocean acidification", threshhold: -1.59, shoot: 15.33, scale: getScale(-1.59, 15.33)},
    {id: 1, pb: "Nitrogen", threshhold: 100, shoot: 72.7, scale: getScale(100, 72.7)},
    {id: 1, pb: "Phosphorus", threshhold: 1.1, shoot: 4, scale: getScale(1.1, 4)},
    {id: 1, pb: "Biodiversity", threshhold: 0.6, shoot: 0.45, scale: getScale(0.6, 0.45)},
  
];

console.log(data.map(d => "Planetery boundary: " + d.pb + " Scale: " + d.scale));


const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    innerRadius = 0,
    outerRadius = Math.min(width, height) / 2;

const svg = d3.select('#dataWiz')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', `translate(${width/2 + margin.left}, ${height/2 + margin.top})`);


const x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(data.map(d => d.pb));

const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data.map(d => d.scale))])

const color = d3.scaleOrdinal()
    .range(["green", "red", "yellow", "blue", "purple"])

console.log(y(data.map(d => d.scale)))

const ybis = d3.scaleRadial()
    .range([innerRadius, 0])
    .domain([d3.max(data.map(d => d.scale)), 0])

svg.append('g')
    .selectAll('path')
    .data(data)
    .join('path')
        .attr('fill', color)
        .attr('class', 'yo')
        .attr('d', d3.arc()
        .innerRadius(d => ybis(d.scale))
        .outerRadius(d => y(d.scale))
        .startAngle(d => x(d.pb))
        .endAngle(d => x(d.pb) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

svg.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
        .attr('text-anchor', function(d) { return (x(d.pb) + x.bandwidth() / 2 + Math.PI)
        % (2 * Math.PI) < Math.PI ? "end" : "start";})
        .attr("transform", function(d) { return "rotate(" + ((x(d.pb) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['scale'])+10) + ",0)"; })
    .append('text')
        .text(d => d.pb)
        .attr("transform", function(d) { return (x(d.pb) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style('font-size', '11px')
        .attr('alignment-baseline', 'middle')
    
// svg.append('g')
//     .selectAll('path')
//     .data(data)
//     .enter()
//     .append('path')
//         .attr('fill', 'green')
//         .attr('d', d3.arc()
//         .innerRadius( function(d) { return ybis(0)})
//         .outerRadius( function(d) { return ybis(d.scale); })
//         .startAngle( function(d) { return x(d.pb);})
//         .endAngle(function(d) { return x(d.pb) + x.bandwidth();})
//         .padAngle(0.01)
//         .padRadius(innerRadius))


// svg.append("g")
//         .attr("transform", "translate(0)")
//         .call(d3.axisTop(y))
//         .attr('stroke', 'black').attr('stroke', 'black')
//         .attr('fill', 'black');

// svg.append("g")
//         .attr("transform", "translate(0)")
//         .call(d3.axisLeft(y))
//         .attr('stroke', 'black')
//         .attr('fill', 'black')

svg.append('g')
    .attr("text-anchor", "middle")
    .call(g => g.append("text")
        .attr("y", d => -y(y.ticks(5).pop()))
        .attr("dy", "-1em"))
    .call(g => g.selectAll("g")
      .data(y.ticks(10).slice(1))
      .enter().append("g")
        .attr("fill", "none")
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 1)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"))
         .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")))

// svg.append("g")
//         .attr("transform", "translate(0)")
//         .call(d3.axisRight(y))
//         .attr('stroke', 'black')
//         .attr('fill', 'black')


