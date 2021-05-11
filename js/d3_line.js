// chart :)

console.log("HEY")

async function drawLineChart() {




    let dimensions = {
        width: 800,
        height: 45,
        margin: {
          top: 15,
          right: 15,
          bottom: 40,
          left: 60,
        },
      }
      dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
      dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom



        const wrapper = d3.select("#wrapper")
            .append("svg")
            //.attr("width", dimensions.width)
            //.attr("height", dimensions.height)
            .attr("viewBox", "-30 -5 60 55")

        const bounds = wrapper.append("g")
            // .style("transform", `translate(${
            //     dimensions.margin.left
            // }px, ${
            //     dimensions.margin.top
            // }px)`)

d3.csv("https://raw.githubusercontent.com/willdebras/shotmaps/master/courtpoints.csv", function(data) {

console.log(data)


var nesteddata = d3.nest() // nest function allows to group the calculation per level of a factor
.key(function(d) { return d.desc;})
.entries(data);

console.log(nesteddata[0])

for (i = 0; i < nesteddata.length; i++) {
    console.log(nesteddata[i].values.length);
  }


    const yAccessor = d => d.y
    const xAccessor = d => d.x

  // 4. Create scales

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yAccessor))
            .range([dimensions.height, 0])


        //const xScale = d3.scaleTime()
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xAccessor))
            .range([0, dimensions.width])

        // 5. Draw data

        const lineGenerator = d3.line()
            .x(d => xAccessor(d))
            .y(d => yAccessor(d))


        bounds.append('rect')
          .attr("width", "50")
          .attr("height", "47")
          .attr("fill", "#fffcf2")
          .style("transform", `translate(-25px, 0px)`)

        bounds
        .selectAll(".line")
        .append("g")
          .attr("class", "line")
        .data(nesteddata)
        .enter()
        .append("path")
          .attr("d", function (d) {
            return d3.line()
            .x(d => d.x)
            .y(d => d.y)
            (d.values)
            })
          .attr("fill", "transparent")
          .attr("stroke", "#17408b")
          .attr("stroke-width", 0.15)


        // 6. Draw peripherals

        // const yAxisGenerator = d3.axisLeft()
        //     .scale(yScale)

        // const yAxis = bounds.append("g")
        //     .call(yAxisGenerator)

        // const xAxisGenerator = d3.axisBottom()
        //     .scale(xScale)

        // const xAxis = bounds.append("g")
        //     .call(xAxisGenerator)
        //     .style("transform", `translateY(${
        //         dimensions.boundedHeight
        //     }px)`)


});


d3.csv("https://raw.githubusercontent.com/willdebras/shotmaps/master/knicks_05_09.csv", function(data) {

console.log(data)

const yAccessor = d => d.loc_y
const xAccessor = d => d.loc_x


const tooltip = d3.select("#tooltip")

function onMouseEnter(d) {

  // const playerDot = bounds.append("circle")
  //     .attr("class", "tooltipDot")
  //     .attr("cx", xAccessor(datum))
  //     .attr("cy", yAccessor(datum))
  //     .attr("r", 1.5)
  //     .style("fill", "maroon")
  //     .style("pointer-events", "none")

  var missedmade = (d.event_type === "Made Shot") ? "made" : "missed"

  var bodyText = "<span style = 'color:#17408b; font-weight:700;'>" + d.player_name + "</span> " + "<i>" + missedmade + "</i> this " + d.shot_distance + "ft. " + d.action_type.toLowerCase() + "<br>in period " + d.period + " with " +  d.minutes_remaining + " minutes, " + d.seconds_remaining + " seconds remaining."

  tooltip.select("#player")
      //.text(d.player_name)
      .html(bodyText)

  // tooltip.select("#shottype")
  //     .text(d.action_type)

  tooltip.select("#league-average")
      .html(d.fg_pct)


  const x = xScale(xAccessor(d))


  const y = yScale(yAccessor(d))

  tooltip.style("transform", `translate(`
    + `calc( -50% + ${x}px),`
    + `calc(-100% + ${y}px - 4px)`
    + `)`)

    // tooltip.style("transform", `translate(`
    // + `calc( -50% + ${d3.event.pageX}px),`
    // + `calc(-100% + ${d3.event.pageY}px)`
    // + `)`)

  tooltip
  .style("opacity", 1)
  // .style("left", (d3.event.pageX + 15) + "px")
  // .style("top", (d3.event.pageY) + "px")
}

function onMouseLeave() {
  d3.selectAll(".tooltipDot")
    .remove()

  tooltip.style("opacity", 0)
}


  // 4. Create scales

  var container = d3.select("svg").node()

  const containerWidth = container.getBoundingClientRect().width;
  const containerHeight = container.getBoundingClientRect().height;

  console.log(containerWidth)
  console.log(containerHeight)
  

        const yScale = d3.scaleLinear()
            .domain([-5, 50])
            .range([0, containerHeight])

        const xScale = d3.scaleLinear()
            .domain([-30, 30])
            .range([0, containerWidth])




        // 5. Draw data

      var colorScale = d3.scaleOrdinal()
      .domain(["made", "missed"])
      .range([ "#ff8c00", "#d3d3d3"])

      var widthScale = d3.scaleOrdinal()
      .domain(["made", "missed"])
      .range([ 0.15, 0.1])

        bounds
        .selectAll(".dot")
        .append("g")
        .attr("class", "dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return (d.loc_x);})
          .attr("cy", function (d) { return (d.loc_y);})
          .attr("r", 0.3)
          .attr("fill", "transparent")
          .attr("stroke", function (d) { return colorScale(d.shot_made_flag)})
          .attr("stroke-width", function (d) { return widthScale(d.shot_made_flag)})
        .on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)


//interactions on dots

// const delaunay = d3.Delaunay.from(
//   data,
//   d => xAccessor(d),
//   d => yAccessor(d),
// )
// const voronoi = delaunay.voronoi()
// voronoi.xmax = dimensions.boundedWidth
// voronoi.ymax = dimensions.boundedHeight

// bounds.selectAll(".voronoi")
//   .data(data)
//   .enter().append("path")
//     .attr("class", "voronoi")
//     .attr("d", (d,i) => voronoi.renderCell(i))
    // .attr("stroke", "salmon")






});



}

drawLineChart()
