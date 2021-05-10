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

        // const line = bounds
        //      .data(nesteddata)
        //      .enter()
        //      .append("path")
        //       .attr("d", function(d){ lineGenerator(d)})
        //       .attr("fill", "none")
        //       .attr("stroke", "#af9358")
        //       .attr("stroke-width", 1)

        //       console.log(line)


        // const lines = bounds
        //     .data(nesteddata)
        //     .enter()
        //     .append("path")
        //       .attr("fill", "none")
        //       .attr("stroke", "#af9358")
        //       .attr("stroke-width", 2)
        //       .attr("d", function(d){
        //         return d3.line()
        //         .x(function(d) { return xScale(d.year); })
        //         .y(function(d) { return yScale(d.mean); })
        //           (d.values)
        //       })

        //console.log(xScale(dateParser(2050)))

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
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 0.25)


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


  // 4. Create scales

        // const yScale = d3.scaleLinear()
        //     .domain(d3.extent(data, yAccessor))
        //     .range([dimensions.height, 0])


        //const xScale = d3.scaleTime()
        // const xScale = d3.scaleLinear()
        //     .domain(d3.extent(data, xAccessor))
        //     .range([0, dimensions.width])

        // 5. Draw data


        bounds
        .selectAll(".dot")
        .append("g")
        .attr("class", "dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return (d.loc_x);})
        .attr("cy", function (d) { return (d.loc_y);})
          .attr("r", 0.2)
          .attr("fill", "none")
          .attr("stroke", "orange")
          .attr("stroke-width", 0.1)



});



}

drawLineChart()
