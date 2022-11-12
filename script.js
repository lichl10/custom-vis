const margin = ({ left: 50, right: 50, top: 50, bottom: 50 });
const width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function position(d) {
    const t = d3.select(this);
    switch (d.side) {
        case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
        case "right":
            t.attr("dx", "0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "start");
            break;
        case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
        case "left":
            t.attr("dx", "-0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "end");
            break;
    }
}

function halo(text) {
    text
        .select(function () {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
}



d3.csv("driving.csv", d3.autoType).then(data => {

    console.log(data)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.miles))
        .nice()
        .range([0, width])


    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.gas))
        .nice()
        .range([height, 0])

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(7)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(12)
        .tickFormat(d3.format("$,.2f"));

    g.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
        .call(g => g.select('.domain').remove())
        .selectAll(".tick line")
        .clone()
        .attr("y1", -height)
        .attr("y2", 0)
        .attr("stroke-opacity", 0.1)

    g.append("g")
        .attr("class", 'axis y-axis')
        .call(yAxis)
        .call(g => g.select('.domain').remove())
        .selectAll(".tick line")
        .clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1)

    g.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .text("Cost per gallon")
        .attr('font-weight', 600)


    g.append("text")
        .attr("x", 420)
        .attr("y", height-5)
        .text("Miles per person per year")
        .attr('font-weight', 600)


    const line = d3.line()
        .x(d => xScale(d.miles))
        .y(d => yScale(d.gas));

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d.miles))
        .attr('cy', d => yScale(d.gas))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("fill", "white")

    g.append("g")
    .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.miles))
        .attr("y", d => yScale(d.gas))
        .text(d => d.year)
        .attr("font-size",13)
        .each(position)
        .call(halo)


});