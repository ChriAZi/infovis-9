function filterData(data) {
    const maxTempYear = data.filter(
        item => item.countriesAndTerritories === 'Germany' && item.year === 2020 && item.month === 11
    );
}

let xAxis;
let yAxis;

let grp;
let margin = {top: 0, right: 0, bottom: 0, left: 0};

const color = ['#FFA687', '#F5F5F5', '#e2efd4'];

let lineV;
let lineDate;

let area;
let series;
let stack;
let stackedData;
let xValue;

let dataDates;
let lineChart;
let dynamicLine;

let bedOccData;
let countyBasedData;

async function initAreaChart() {
    let data = await d3.csv('data/data_Auslastung.csv');
    data.forEach(d => {
        d.date = new Date(d.date)
        d.Belegte = +d.Belegte
        d.Freie = +d.Freie
        d.Notfallreserve = +d.Notfallreserve
    })
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

    let chart = svg.append('g');

    grp = chart.append('g');

    // Create stack
    const stack = d3.stack().keys(['Belegte', 'Freie', 'Notfallreserve']);
    const stackedData = stack(data);// Create scales
    const xValue = d => d.date;

    //x-Axis
    xAxis = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, width]);
    xAxisGerman = d3.axisBottom(xAxis).tickFormat(customTimeFormat);
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
    chart
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .attr('id', 'area-chart-x-axis')
        .call(xAxisGerman)

    // Add the Y Axis
    chart
        .append('g')
        .attr('transform', `translate(${width}, 0)`)
        .attr('id', 'area-chart-y-axis')
        .call(d3.axisRight(yAxis))

    // Add line
    grp
        .append('line')
        .datum(data)
        .attr('x1', xAxis(lineDate) - margin.right)
        .attr('x2', xAxis(lineDate) - margin.right)
        .attr('y1', margin.top + 10)
        .attr('y2', yAxis(margin.bottom))
        .attr('stroke', 'black')
        .style('stroke-width', 1.5);

    //Add line text
    lineText = chart.append('text')
        .attr('x', xAxis(lineDate) - margin.right)
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .attr('stroke', 'black')
        .text(getDateInFormat(selectedDate));

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
}

function updateAreaChart() {
    lineDate = new Date(selectedDate);
    grp.select('line')
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .attr('x1', xAxis(lineDate) - margin.right)
        .attr('x2', xAxis(lineDate) - margin.right)
        .attr('y1', margin.top + 10)
        .attr('y2', yAxis(margin.bottom))
        .attr('stroke', 'black')
        .style('stroke-width', 1);

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
            dynamicLine = chart.append("path")
                .attr('class', 'line')
                // .attr("d", lineChart(dataDates))
                .attr("fill", "none")
                //.attr("stroke", metricColor)
                .attr("stroke-width", 2);

            chart.select('.line').datum(dataDates)
                .transition()
                .duration(1000)
                .attr("stroke", 'orange')
                .attr("d", d3.line()
                    .x(function (d) {
                        d = new Date(d);
                        return xScale(d)
                    })
                    .y(function (d) {
                        return yScale(data[d][selectedCountyId][selectedMetric]);
                    })
                )
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
