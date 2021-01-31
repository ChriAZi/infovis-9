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
let metricColor;

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
    //setMargin();

    countyBasedData = await d3.csv('data/Landkreise_Auslastung.csv');

    let parent = $('.area-container');
    let margin = {top: 50, right: 80, bottom: 50, left: 50};
    let width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom;

    d3.select('#area-chart').selectAll('*').remove();

    let svg = d3
        .select('#area-chart')
        .append('svg')
        .attr('id', 'area-chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + (margin.left + 14) + ',' + (margin.top + 10) + ')');

    chart = svg.append('g');

    grp = chart.append('g');

    // Create stack
    stack = d3.stack().keys(['Belegte', 'Freie', 'Notfallreserve']);
    stackedData = stack(data); // Create scales
    xValue = d => d.date;

    //x-Axis
    xScale = d3.scaleTime()
        .domain(d3.extent(domain))
        .range([0, width]);
    xAxisGerman = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

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
        .attr('id', 'area-chart-left-axis')
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
            (height + (margin.bottom / 2) + 10 ) + ')')
        .style('text-anchor', 'middle')
        .text('Zeit');

    // text label for the y axis
    chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', width + margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Anzahl Betten');
    
    yAxisLineText = chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left - 14)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle');
    
    lineChart = d3.line();
    updateAreaChart();
}

function updateAreaChart() {
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
        
        dynamicLine = chart.append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke-width', 3);

        yScaleLine.domain([0, getMaxValue()]);
        yAxisLine.transition().duration(500).ease(d3.easeLinear).attr('display', 'block')
            .call(d3.axisLeft(yScaleLine));

        yAxisLineText.text(Metric.properties[selectedMetric].name).attr('display', 'block');


        chart.select('.line')
            .datum(dataDates)
            .transition()
            .duration(1000)
            .attr('stroke', Metric.properties[selectedMetric].baseColor)
            .attr('d', d3.line()
                .x(function (d) {
                    d = new Date(d);
                    return xScale(d)
                })
                .y(function (d) {
                    if (selectedMetric === 'lethalityRate') {
                        let rate = getLethalityRate('all', d);
                        let lethValue = Math.round(((rate * 100) + Number.EPSILON) * 100) / 100;
                        return yScaleLine(lethValue);
                    } else {
                        return yScaleLine(data[d]['all'][selectedMetric]);
                    }
                })
            )
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
    let selectedData = countyBasedData.filter(function (d) {
        d.daten_stand = new Date(d.daten_stand)
        d.gemeindeschluessel = d.gemeindeschluessel
        d.betten_frei = +d.betten_frei
        d.betten_belegt = +d.betten_belegt
        return d['gemeindeschluessel'] === selectedCountyId;
    })

    stack = d3.stack().keys(['betten_belegt', 'betten_frei', 'notfallreserve_betten']);
    stackedData = stack(selectedData);
    yScale.domain([0, d3.max(stackedData[stackedData.length - 1], function (d) {
        return d[1]
    })])
    yAxis.transition().duration(1500).ease(d3.easeLinear)
        .call(d3.axisRight(yScale));
    
    yScaleLine.domain([0, getMaxValue()]);
    yAxisLine.transition().duration(1000).ease(d3.easeLinear).attr('display', 'block')
        .call(d3.axisLeft(yScaleLine));
    
    yAxisLineText.text(Metric.properties[selectedMetric].name).attr('display', 'block');
    
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
        .attr('stroke-width', 3);

    chart.select('.line').datum(dataDates)
        .transition()
        .duration(1000)
        .attr('stroke', Metric.properties[selectedMetric].baseColor)
        .attr('d', d3.line()
            .x(function (d) {
                d = new Date(d);
                return xScale(d)
            })
            .y(function (d) {
                if (selectedMetric === 'lethalityRate') {
                    let rate = getLethalityRate(selectedCountyId, d);
                    let lethValue = Math.round(((rate * 100) + Number.EPSILON) * 100) / 100;
                    return yScaleLine(lethValue);
                } else {
                    return yScaleLine(data[d][selectedCountyId][selectedMetric]);
                }
            })
        )

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
    return lineDate;
}

function getMaxValue() {
    let maxMetricValue;
    maxMetricValue = 0;
    dataDates = Object.keys(data);
    if (selectedCountyId === null) {
        if (selectedMetric === 'lethalityRate') {
            dataDates.forEach(obj => {
                let lethalityRate = getLethalityRate('all', obj);
                let metricValue = Math.round(((lethalityRate * 100) + Number.EPSILON) * 100) / 100;
                if (metricValue > maxMetricValue) {
                    maxMetricValue = metricValue;
                }
            })
        } else {
            dataDates.forEach(dataDate => {
                maxScaleLine = 0;
                let tempr = data[dataDate]['all'][selectedMetric];
                if (maxMetricValue < tempr) {
                    maxMetricValue = tempr;
                }
            })
        }
    } else {
        if (selectedMetric === 'lethalityRate') {
            dataDates.forEach(obj => {
                let lethalityRate = getLethalityRate(selectedCountyId, obj);
                let metricValue = Math.round(((lethalityRate * 100) + Number.EPSILON) * 100) / 100;
                if (metricValue > maxMetricValue) {
                    maxMetricValue = metricValue;
                }
            })
        } else {
            dataDates.forEach(obj => {
                let metricValue = data[obj][selectedCountyId][selectedMetric];
                if (metricValue > maxMetricValue) {
                    maxMetricValue = metricValue;
                }
            })
        }
    }
    return maxMetricValue;
}

function getFormattedDate(date) {
    date = date.toISOString().split('T')[0]
    date = date.replaceAll('-', '/')
    return date;
}
