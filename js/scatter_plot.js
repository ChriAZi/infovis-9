function setScatterPlot() {

    let parent = $('.scatter-container');
    let width = parent.width();
    let height = parent.height();
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    var svg = d3.select('#scatter-plot')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    d3.json('data/RKI_Corona_Landkreise.geojson').then(function (data) {
        //d3.json("data/data.json", function(data){
        //d3.json("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson").then(function(data){

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 1000000])
            .range([0, width]);

        svg.append('g')
            .attr('id', 'x-axis')
            .call(d3.axisBottom(x).ticks(5, 'f'))
            .append('style').text('text { font-family: var(--font-family)}')
            .append('style').text('text { font-size: var(--font-size-timeline)}')
            .append('style').text('text { color: var(--font-color)}');

        // text label for the x axis
        svg.append('text')
            .attr('id', 'x-label')
            .attr('transform',
                'translate(' + (width / 2) + ' ,' + height + ')')
            .style('text-anchor', 'middle')
            .text('Population')
            .append('style').text('text { font-family: var(--font-family)}')
            .append('style').text('text { font-size: var(--font-size-timeline)}')
            .append('style').text('text { color: var(--font-color)}');

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 20000])
            .range([height, 0]);

        svg.append('g')
            .attr('id', 'y-axis')
            .call(d3.axisLeft(y))
            .append('style').text('text { font-family: var(--font-family)}')
            .append('style').text('text { font-size: var(--font-size-timeline)}')
            .append('style').text('text { color: var(--font-color)}');

        // text label for the y axis
        svg.append('text')
            .attr('id', 'y-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Cases')
            .append('style').text('text { font-family: var(--font-family)}')
            .append('style').text('text { font-size: var(--font-size-timeline)}')
            .append('style').text('text { color: var(--font-color)}');

        // Add dots
        svg.append('g')
            .attr('id', 'point-container')
            .selectAll('dot')
            .data(data.features)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x(d.properties.EWZ);
            })
            .attr('cy', function (d) {
                return y(d.properties.cases);
            })
            .attr('r', 1.5)
            .style('fill', 'turquoise')

        // Adjust Spacing - x-Axis
        let xAxis = $('g#x-axis').get(0);
        let xAxisHeight = xAxis.getBBox().height;
        let xLabelHeight = $('text#x-label').get(0).getBBox().height;
        let heightToBeAdjusted = +xAxisHeight + +xLabelHeight;
        xAxis.setAttribute('transform', 'translate(0,' + (height - heightToBeAdjusted) + ')');

        // Adjust Spacing - y-Axis
        let yAxis = $('g#y-axis').get(0);
        let yAxisWidth = yAxis.getBBox().width;
        let yLabelWidth = $('text#y-label').get(0).getBBox().width;
        let widthToBeAdjusted = +yAxisWidth + +yLabelWidth;
        yAxis.setAttribute('transform', 'translate(' + widthToBeAdjusted + ', 0)');

        // Adjust spacing for points
        let pointContainer = $('g#point-container').get(0);
        pointContainer.setAttribute('transform', 'translate(' + widthToBeAdjusted + ', ' + -heightToBeAdjusted + ')');
    });
}