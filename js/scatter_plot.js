function setScatterPlot() {

    var margin = {top: 10, right: 80, bottom: 80, left: 80},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/RKI_Corona_Landkreise.geojson").then(function (data) {
        //d3.json("data/data.json", function(data){
        //d3.json("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson").then(function(data){

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 1000000])
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5, "f"));

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 40) + ")")
            .style("text-anchor", "middle")
            .text("Population")

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 20000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Cases");
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data.features)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d.properties.EWZ);
            })
            .attr("cy", function (d) {
                return y(d.properties.cases);
            })
            .attr("r", 1.5)
            .style("fill", "turquoise")

    });
}