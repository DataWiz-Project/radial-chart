
// Convert methods
const percentageIncrease = (threshold, shoot) => {
    const increase = shoot - threshold
    return parseInt(increase / shoot * 100)
  }
  const percentageDecrease = (threshold, shoot) => {
    const decrease = threshold - shoot
    return parseInt(decrease / shoot * 100)
  }

  const getScale =(threshold, shoot) => {
    if(threshold > shoot){
      return percentageDecrease(threshold, shoot)
    }else{
      return percentageIncrease(threshold, shoot)
    }
  }

// Temporary data
const data = [
    {id: 1, pb: "climate change", threshhold: -2.35, shoot: 18.95, scale: getScale(-2.35, 18.95)},
    {id: 1, pb: "Ocean acidification", threshhold: -1.59, shoot: 15.33, scale: getScale(-1.59, 15.33)},
    {id: 1, pb: "Nitrogen", threshhold: 100, shoot: 72.7, scale: getScale(100, 72.7)},
    {id: 1, pb: "Phosphorus", threshhold: 1.1, shoot: 4, scale: getScale(1.1, 4)},
    {id: 1, pb: "Biodiversity", threshhold: 0.6, shoot: 0.45, scale: getScale(0.6, 0.45)},
  
];

console.log(data.map(d => "Planetery boundary: " + d.pb + " Scale: " + d.scale));

// Chart size settings
const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    innerRadius = 0,
    outerRadius = 0 ;
// const margin = {top: 100, right: 0, bottom: 0, left: 0},
//     width = 460 - margin.left - margin.right,
//     height = 460 - margin.top - margin.bottom,
//     innerRadius = 90,
//     outerRadius = Math.min(width, height) / 2;

// Chart container
const svg = d3.select('#dataWiz')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', `translate(${width/2 + margin.left}, ${height/2 + margin.top})`);


// Scales 
const x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(data.map(d => d.pb));

// const y = d3.scaleRadial()
//     .range([100, 200])
//     .domain([0, d3.max(data.map(d => d.scale))])

// const y = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.scale)])
//     .range([innerRadius * innerRadius, outerRadius * outerRadius]);
// return Object.assign(d => Math.sqrt(y(d)), y);

const z = d3.scaleOrdinal()
    .domain(data.map(d => d.pb).slice(2))
    .range(["#CC0033", "#00bc12", "#F5EB00", "#FAB300"])

const color = d3.scaleOrdinal()
    .range(["green", "red", "yellow", "blue", "purple"])

const ybis = d3.scaleRadial()
    .range([innerRadius, 0])
    .domain([d3.max(data.map(d => d.scale)),d3.min(data.map(d => d.scale)) ])

// Displays the data in an arc (circle)
svg.append('g')
    .selectAll("g")
    .data(d3.stack().keys(data.map(d => d.pb).slice(1))(data))
    .join("g")
        .attr('fill', d => z(d.key))


    .selectAll('path')
    .data(d => d)
    .join('path')
        .attr('class', 'yo')
        .attr('d', d3.arc()
        .innerRadius(d => ybis(d.scale))
        .outerRadius(d => y(d.scale))
        .startAngle(d => x(d.pb))
        .endAngle(d => x(d.pb) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

// Place Labels 
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

// Value axis
// svg.append("g")
//     .call(y)
//     .style("transform", `translateY(${height/2}px)`)
//     .attr("height", height/2)
//     .attr("width", "8px")
    
//     svg.append("g")
//     .selectAll("path")
//     .data(data)
//     .join("path")
//       .attr("fill", "red")
//       .attr("d", d3.arc()     // imagine your doing a part of a donut plot
//           .innerRadius( d => ybis(d["Scale"]))
//           .outerRadius( d => ybis(d['Scale']))
//           .startAngle(d => x(d.pb))
//           .endAngle(d => x(d.pb) + x.bandwidth())
//           .padAngle(0.01)
//           .padRadius(innerRadius))

