function filterData(data) {
    const maxTempYear = data.filter(
        item => item.countriesAndTerritories === 'Germany' && item.year == 2020 && item.month == 11
    );
}

const color = ["lightblue", "lightgreen", "#CC99FF"];
const svg = d3
    .select("#area-chart")
    .append("svg")
    .attr("height", 460)
    .attr("width", 640);

const strokeWidth = 1.5;
var margin = {top: 0, bottom: 20, left: 80, right: 20};
const chart = svg.append("g").attr("transform", `translate(${margin.left},0)`);

var width = +svg.attr("width") - 200 - margin.left - margin.right - strokeWidth * 2;
var height = +svg.attr("height") - 200 - margin.top - margin.bottom;
var xAxis;
var yAxis;
var lineText;
var lineDate = new Date();
var lineDateFormatted = lineDate.toISOString().split('T')[0];
lineDateFormatted = lineDateFormatted.replace(/-/g, '/');

const grp = chart
    .append("g")
    .attr("transform", `translate(-${margin.left - strokeWidth},-${margin.top})`);

d3.csv("data/data_Auslastung.csv")
    .then(function (data) {
        data.forEach(d => {
            d.date = new Date(d.date)
            d.Belegte = +d.Belegte
            d.Freie = +d.Freie
            d.Notfallreserve = +d.Notfallreserve
        })

        // Create stack
        const stack = d3.stack().keys(["Belegte", "Freie", "Notfallreserve"]);
        const stackedData = stack(data);// Create scales
        const xValue = d => d.date;

        //x-Axis
        xAxis = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, width]);

        //y-Axis
        yAxis = d3.scaleLinear()
            .domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
                return d[1]
            })])
            .range([height, 0]);

        var area = d3.area().x(function (d) {
            return xAxis(d.data.date);
        })
            .y0(function (d) {
                return yAxis(d[0]);
            })
            .y1(function (d) {
                return yAxis(d[1]);
            })

        const series = grp
            .selectAll(".series")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "series");

        series
            .append("path")
            .attr("transform", `translate(${margin.left},20)`)
            .style("fill", (d, i) => color[i])
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", strokeWidth)
            .attr("d", d => area(d));

        // Add the X Axis
        chart
            .append("g")
            .attr("transform", `translate(0,${height+20})`)
            .call(d3.axisBottom(xAxis));

        // Add the Y Axis
        chart
            .append("g")
            .attr("transform", `translate(${width+1}, 20)`)
            .call(d3.axisRight(yAxis));
    
               // Add line
        grp
            .append("line")
            .datum(data)
            .attr('x1', xAxis(lineDate) + margin.left - strokeWidth / 2)
            .attr('x2', xAxis(lineDate) + margin.left - strokeWidth / 2)
            .attr('y1', 20)
            .attr('y2', yAxis(0) + 20)
            .attr('stroke', 'white')
            .style("stroke-width", 2);

        //Add line text
        lineText = chart.append("text")
            .attr("y", 10)
            .attr("x", xAxis(lineDate))
            .attr('text-anchor', 'middle')
            .attr('stroke', 'white')
            .style("font-size", 12)
            .text(lineDateFormatted);

        // text label for the x axis
        chart.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 60) + ")")
            .style("text-anchor", "middle")
            .text("Time")

        // text label for the y axis
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", width+50)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Beds");
    })

function updateAreaChart(selectedDate) {
    lineDate = new Date(selectedDate);
    grp.select("line")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('x1', xAxis(lineDate) + margin.left - strokeWidth / 2)
        .attr('x2', xAxis(lineDate) + margin.left - strokeWidth / 2)
        .attr('y1', 20)
        .attr('y2', yAxis(0) + 20)
        .attr("stroke", 'black')
        .style("stroke-width", 2);
    lineText.transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('x', xAxis(lineDate))
        .attr('y', 10)
        .attr('stroke', 'black')
        .text(selectedDate);
}
