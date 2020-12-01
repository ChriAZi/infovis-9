function filterData(data){
    const maxTempYear = data.filter(
        item => item.countriesAndTerritories === 'Germany' && item.year == 2020 && item.month == 11
    );

    //visualiseChart(maxTempYear);
}
const color = [ "lightblue","lightgreen","CC99FF"];

const svg = d3
    .select("#areaChart")
    .append("svg")
    .attr("height", 500)
    .attr("width", 690);

const strokeWidth = 1.5;
var margin = { top: 0, bottom: 20, left: 80, right: 20 };
const chart = svg.append("g").attr("transform", `translate(${margin.left},0)`);

var width = +svg.attr("width")-200 - margin.left - margin.right - strokeWidth * 2;
var height = +svg.attr("height")-200 - margin.top - margin.bottom;


const grp = chart
    .append("g")
    .attr("transform", `translate(-${margin.left - strokeWidth},-${margin.top})`);


d3.csv("/infoVis9/data_Auslastung.csv")
    .then(function(data) {
        data.forEach(d => {
            d.date = new Date(d.date)
            d.Belegte = +d.Belegte
            d.Freie = +d.Freie
            d.Notfallreserve= +d.Notfallreserve
        })


// Create stack
        const stack = d3.stack().keys(["Belegte", "Freie","Notfallreserve"]);
        const stackedData = stack(data);// Create scales
        const xValue = d => d.date;

        //x-Axis
        var xAxis = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            //.domain([1,12])
            .range([0, width]);


        //y-Axis
        var yAxis = d3.scaleLinear()
            .domain([0, d3.max(stackedData[stackedData.length-1], function (d){return d[1]})])
            .range([height, 0]);

        var area= d3.area().x(function (d) {return xAxis(d.data.date);})
            .y0(function (d){return yAxis(d[0]);})
            .y1(function (d){return yAxis(d[1]);})

        const series = grp
            .selectAll(".series")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "series");

        series
            .append("path")
            .attr("transform", `translate(${margin.left},0)`)
            .style("fill", (d, i) => color[i])
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", strokeWidth)
            .attr("d", d => area(d));

// Add the X Axis

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xAxis));

// Add the Y Axis

        chart
            .append("g")
            .attr("transform", `translate(0, 0)`)
            .call(d3.axisLeft(yAxis));


        // Highlight function TO DO
        var highlight = function(d){
            console.log(d)

        }

        // And when it is not hovered anymore
        var noHighlight = function(d){
        }




        // Legend
        var size = 20
        svg.selectAll("rect")
            .data(["Belegte", "Freie","Notfallreserve"])
            .enter()
            .append("rect")
            .attr("x", 500)
            .attr("y", function(d,i){ return 10 + i*(size+80)})
            .attr("width", size)
            .attr("height", size)
            .style("fill",  (d, i) => color[i])
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight);

        svg.selectAll("labels")
            .data(["Belegte", "Freie","Notfallreserve"])
            .enter()
            .append("text")
            .attr("x", 490)
            .attr("y", function(d,i){ return 50 + i*(size+80) + (size/2)}) 
            .style("fill",  (d, i) => color[i])
            .text(function(d){ return d+' Betten'})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight);
    } )

