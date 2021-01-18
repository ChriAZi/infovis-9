function filterData(data) {
    const maxTempYear = data.filter(
        item => item.countriesAndTerritories === 'Germany' && item.year === 2020 && item.month === 11
    );
}

let chart;

let xScale;
let yScale;
let xAxis;
let yAxis;

let grp;
let margin = {top: 0, right: 0, bottom: 0, left: 0};

const color = ['#ffea4c', '#F5F5F5', '#8ab670'];

let lineV;
let lineDate = new Date();

let area;
let series;
let stack;
let stackedData;
let xValue;

let bedOccData;
let countyBasedData;

function initAreaChart() {
    d3.csv('data/data_Auslastung.csv')
        .then(function (data) {
            data.forEach(d => {
                d.date = new Date(d.date)
                d.Belegte = +d.Belegte
                d.Freie = +d.Freie
                d.Notfallreserve = +d.Notfallreserve
            })
            bedOccData=data;
            setMargin();

            let parent = $('.area-container');
            let width = parent.width() - margin.left - margin.right;
            let height = parent.height() - margin.top - margin.bottom;

            d3.select('#area-chart').selectAll('*').remove();

            let svg = d3
                .select('#area-chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            chart = svg.append('g');

            grp = chart.append('g');

            // Create stack
            stack = d3.stack().keys(['Belegte', 'Freie', 'Notfallreserve']);
            stackedData = stack(data);// Create scales
            xValue = d => d.date;

            //x-Axis
            xScale = d3.scaleTime()
                .domain(d3.extent(data, xValue))
                .range([0, width]);

            //y-Axis
            yScale = d3.scaleLinear()
                .domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
                    return d[1]
                })])
                .range([height, 0]);

            area = d3.area().x(function (d) {
                return xScale(d.data.date);
            })
                .y0(function (d) {
                    return yScale(d[0]);
                })
                .y1(function (d) {
                    return yScale(d[1]);
                })

            series = grp
                .selectAll('.series')
                .data(stackedData)
                .enter()
                .append('g')
                .attr('class', 'series');

            series
                .append('path')
                .style('fill', (d, i) => color[i])
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 0.5)
                .attr('d', d => area(d));

            // Add the X Axis
            xAxis = chart
                .append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(xAxis))
                .append('style').text('text { font-family: var(--font-family)}')
                .append('style').text('text { font-size: var(--font-size-axis-label) !important}')
                .append('style').text('text { color: var(--font-color)}');

            // Add the Y Axis
            yAxis = chart
                .append('g')
                .attr('transform', `translate(${width}, 0)`)
                .call(d3.axisRight(yAxis))
                .append('style').text('text { font-family: var(--font-family)}')
                .append('style').text('text { font-size: var(--font-size-axis-label) !important}')
                .append('style').text('text { color: var(--font-color)}');

            // Add line
            lineV = grp
                .append('line')
                .datum(data)
                .attr('x1', xScale(lineDate) - margin.right)
                .attr('x2', xScale(lineDate) - margin.right)
                .attr('y1', margin.top + 10)
                .attr('y2', yScale(margin.bottom))
                .attr('stroke', 'black')
                .style('stroke-width', 3);

            // add styles
            chart.append('style').text('text { font-weight: lighter;)}')

            // text label for the x axis
            chart.append('text')
                .attr('transform',
                    'translate(' + (width / 2) + ' ,' +
                    (height + margin.bottom) + ')')
                .style('text-anchor', 'middle')
                .text('Zeit');

            // text label for the y axis
            chart.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', width + margin.right)
                .attr('x', 0 - (height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .text('Anzahl Betten');
        })

}

function updateAreaChart() {
    lineDate = new Date(selectedDate);
    grp.select('line')
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .attr('x1', xScale(lineDate) - margin.right)
        .attr('x2', xScale(lineDate) - margin.right)
        .attr('y1', margin.top + 10)
        .attr('y2', yScale(margin.bottom))
        .attr('stroke', 'black')
        .style('stroke-width', 3);

}

function updateAreaCountyBased() {

    d3.csv("data/Landkreise_Auslastung.csv")
        .then(function (countyData) {
            countyBasedData = countyData.filter(function (d) {
                d.daten_stand = new Date(d.daten_stand)
                d.gemeindeschluessel = d.gemeindeschluessel
                d.betten_frei = +d.betten_frei
                d.betten_belegt = +d.betten_belegt
                return d["gemeindeschluessel"] === selectedCountyId;
            })

            stack = d3.stack().keys(["betten_belegt", "betten_frei", "notfallreserve_betten"]);
            stackedData = stack(countyBasedData);
            yScale.domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
                return d[1]
            })])
            yAxis.transition().duration(1500).ease(d3.easeLinear)
                .call(d3.axisRight(yScale));

            area = d3.area().x(function (d) {
                return xScale(d.data.daten_stand);
            })
                .y0(function (d) {
                    return yScale(d[0]);
                })
                .y1(function (d) {
                    return yScale(d[1]);
                })

            chart.selectAll("path")
                .data(stackedData)
                .transition().duration(1000)
                .style("opacity", 1)
                .attr("d", d => area(d));

        })
}

function setMargin() {
    margin = {
        top: 2.5 * (document.documentElement.clientHeight / 100),
        right: 3 * (document.documentElement.clientWidth / 100),
        bottom: 2.5 * (document.documentElement.clientWidth / 100),
        left: 3 * (document.documentElement.clientHeight / 100)
    }
}