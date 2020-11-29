function filterData(data){
    const maxTempYear = data.filter(
        item => item.countriesAndTerritories === 'Germany' && item.year == 2020 && item.month == 11
    );

    visualiseChart(maxTempYear);
}

function visualiseChart(data){
    d3.select("#mySlider")
    .attr("min", 1)
    .attr("max", 12)
    .attr("value", 1);
    var margin = {top: 10, right: 80, bottom: 80, left:80},
    width = 460 - margin.left -margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#areaChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //x-Axis
    var xAxis = d3.scaleLinear()
        //.domain(d3.extent(data, item=> Number(item.day)))
        .domain([1,12])
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xAxis));
        
        
    // text label for the x axis
    svg.append("text")             
        .attr("transform",
            "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("November")

    //y-Axis
    var yAxis = d3.scaleLinear()
        //.domain([d3.min(data, item=>Number(item.cases)) - 1, d3.max(data, item=>Number(item.cases))])
        //.domain([0, d3.max(data, item=>Number(item.wert))])
        .domain([0, 23000])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yAxis));

    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Cases");  

    //curve
    var curve = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "turquoise")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(item => xAxis(Number(item.day)))
            .y(item => yAxis(Number(item.cases)))
            );

   /* d3.select("#mySlider")
        .on("change", function(d){
            selectedValue = this.value
            xAxis.domain([selectedValue, d3.max(data, item=>Number(item.day))])
                .range([0, width]);

            svg.select("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xAxis));
            
            curve.datum(data)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(item => xAxis(Number(item.day)))
                    .y(item => yAxis(Number(item.cases)))
                );
        })*/
}
