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

const color = [
    Metric.properties.icuBeds.occupied.color,
    Metric.properties.icuBeds.free.color,
    Metric.properties.icuBeds.reserve.color
];
let margin = {
    top: 2.5 * (document.documentElement.clientHeight / 100),
    right: 3 * (document.documentElement.clientWidth / 100),
    bottom: 2.5 * (document.documentElement.clientWidth / 100),
    left: 3 * (document.documentElement.clientHeight / 100)
}

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

let yScaleLine;
let yAxisLine;
let yAxisLineText;
let minDate;

async function initAreaChart() {

    let data = await d3.csv('data/data_Auslastung.csv');
    data.forEach(d => {
        d.date = new Date(d.date)
        d.Belegte = +d.Belegte
        d.Freie = +d.Freie
        d.Notfallreserve = +d.Notfallreserve
    })
    bedOccData = data;
    minDate = bedOccData[0].date;
    setMargin();

    let parent = $('.area-container');
    let width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom;

    d3.select('#area-chart').selectAll('*').remove();

    let svg = d3
        .select('#area-chart')
        .append('svg')
        .attr('id', 'area-chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    chart = svg.append('g');

    grp = chart.append('g');

// Create stack
    stack = d3.stack().keys(['Belegte', 'Freie', 'Notfallreserve']);
    stackedData = stack(data); // Create scales
    xValue = d => d.date;

//x-Axis
    xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, width]);
    xAxisGerman = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B"));

    //y-Axis
    yScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
            return d[1]
        })])
        .range([height, 0]);
    
    yScaleLine = d3.scaleLinear()
        .domain([0, getMaxValue(selectedMetric)])
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
        .attr('id', 'area-chart-x-axis')
        .call(xAxisGerman);

// Add the Y Axis
    yAxis = chart
        .append('g')
        .attr('transform', `translate(${width}, 0)`)
        .attr('id', 'area-chart-y-axis')
        .call(d3.axisRight(yScale));
    yAxisLine = chart
        .append('g')
        .attr('display', 'none')
        .call(d3.axisLeft(yScaleLine));
    
// Add line
    lineV = grp
        .append('line')
        .datum(data)
        .attr('x1', xScale(getLineDate()))
        .attr('x2', xScale(getLineDate()))
        .attr('y1', 0)
        .attr('y2', yScale(0))
        .attr('stroke', 'black')
        .style('stroke-width', 1);

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
    
    yAxisLineText = chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left - 14)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .text(getMetricsText())
        .attr('display', 'none')
        .style('text-anchor', 'middle');
    
    lineChart = d3.line();
        })
}

function updateAreaChart() {
    lineDate = new Date(selectedDate);
    if (selectedCountyId !== null) {
        updateAreaCountyBased();
    } else {
        stack = d3.stack().keys(['Belegte', 'Freie', 'Notfallreserve']);
        stackedData = stack(bedOccData);
        xValue = d => d.date;
        yScale.domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
            return d[1]
        })])
        yAxis.transition().duration(1500).ease(d3.easeLinear)
            .call(d3.axisRight(yScale));

        area = d3.area().x(function (d) {
            return xScale(d.data.date);
        })
            .y0(function (d) {
                return yScale(d[0]);
            })
            .y1(function (d) {
                return yScale(d[1]);
            })

        chart.selectAll('path')
            .data(stackedData)
            .transition().duration(60)
            .style('opacity', 1)
            .attr('d', d => area(d));
        
        yAxisLine.attr('display', 'none');
        yAxisLineText.attr('display', 'none');
        d3.select('path.line').remove();
    }

    lineV
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .attr('x1', xScale(getLineDate()))
        .attr('x2', xScale(getLineDate()))
        .attr('y1', 0)
        .attr('y2', yScale(0))
        .attr('stroke', 'black')
        .style('stroke-width', 1);

}

async function updateAreaCountyBased() {

    d3.csv('data/Landkreise_Auslastung.csv').then(countyData => {
        countyBasedData = countyData.filter(function (d) {
            d.daten_stand = new Date(d.daten_stand)
            d.gemeindeschluessel = d.gemeindeschluessel
            d.betten_frei = +d.betten_frei
            d.betten_belegt = +d.betten_belegt
            return d['gemeindeschluessel'] === selectedCountyId;
        })

        stack = d3.stack().keys(['betten_belegt', 'betten_frei', 'notfallreserve_betten']);
        stackedData = stack(countyBasedData);
        yScale.domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
            return d[1]
        })])
        yAxis.transition().duration(1500).ease(d3.easeLinear)
            .call(d3.axisRight(yScale));
        
        yScaleLine.domain([0, getMaxValue(selectedMetric)]);
        yAxisLine.transition().duration(1000).ease(d3.easeLinear).attr('display', 'block')
            .call(d3.axisLeft(yScaleLine));
        yAxisLineText.attr('display', 'block');
        
        area = d3.area().x(function (d) {
            return xScale(d.data.daten_stand);
        })
            .y0(function (d) {
                return yScale(d[0]);
            })
            .y1(function (d) {
                return yScale(d[1]);
            })

        chart.selectAll('path')
            .data(stackedData)
            .transition().duration(1000)
            .style('opacity', 1)
            .attr('d', d => area(d));
        dynamicLine = chart.append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke-width', 2);

        chart.select('.line').datum(dataDates)
            .transition()
            .duration(1000)
            .attr('stroke', setMetricColor())
            .attr('d', d3.line()
                .x(function (d) {
                    d = new Date(d);
                    return xScale(d)
                })
                .y(function (d) {
                    return yScale(data[d][selectedCountyId][selectedMetric]);
                })
            )
    });

}

function setMargin() {
    margin = {
        top: 2.5 * (document.documentElement.clientHeight / 100),
        right: 3 * (document.documentElement.clientWidth / 100),
        bottom: 2.5 * (document.documentElement.clientWidth / 100),
        left: 3 * (document.documentElement.clientHeight / 100)
    }
}

function getLineDate() {

    lineDate = new Date(selectedDate);
    if (lineDate < minDate) {
        lineDate = minDate;
    } else {
    }
    return lineDate;
}

function getMaxValue(metric) {
    let maxMetricValue;
    maxMetricValue = 0;
    if (selectedCountyId === null) {
        maxMetricValue = 0
    } else {
        dataDates = Object.keys(data).filter(item => item === getFormattedDate(minDate) || new Date(item) > new Date(minDate));
        console.log('Data dates are ' + dataDates);
        dataDates.forEach(obj => {
            let metricValue = data[obj][selectedCountyId][metric];
            if (metricValue > maxMetricValue) {
                maxMetricValue = metricValue;
            }
        })
    }
    return maxMetricValue;
}

function getFormattedDate(date) {
    date = date.toISOString().split('T')[0]
    date = date.replaceAll('-', '/')
    return date;
}

function setMetricColor() {
    switch (selectedMetric) {
        case 'newCases':
            metricColor = '#ffaa00';
            break;
        case 'totalCases':
            metricColor = '#ffea4c';
            break;
        case 'newDeaths':
            metricColor = '#333333';
            break;
        case 'totalDeaths':
            metricColor = '#002ea3';
            break;
        case 'caseIncidence':
            metricColor = '#78121e';
            break;
        case 'deathIncidence':
            metricColor = '#de0000';
        default:
            metricColor = '#ffaa00';
    }
    return metricColor;
}
