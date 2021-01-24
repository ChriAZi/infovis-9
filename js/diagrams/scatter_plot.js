const countyNames = [];

function initScatterPlot() {
    for (i in geoData.features) {
        countyNames[geoData.features[i].properties.AGS] = geoData.features[i].properties.GEN;
    }
    updateScatterplot();
}

function updateScatterplot() {
    let parent = $('.scatter-container');
    let margin = {top: 50, right: 50, bottom: 50, left: 50};
    let width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom;

    let formatPercent = d3.format('.0%');
    let offsetYAxis = 1;

    d3.select('#scatter-plot').selectAll('*').remove();
    var filteredIds = Object.keys(counties).filter(item => item !== 'all' && Object.keys(countyNames).includes(item));

    var svg = d3.select('#scatter-plot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('id', 'scatter-plot-svg')
        .append('g')
        .attr('transform', 'translate(' + (margin.left + 14) + ',' + margin.top + ')');

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(filteredIds, function (d) {
            return counties[d].density != null ? counties[d].density : 0
        }) + 1])
        .range([0, width]);

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).ticks(5, 'f'));

    // text label for the x axis
    svg.append('text')
        .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top - 10) + ')')
        .style('text-anchor', 'middle')
        .text('Bevölkerungsdichte');

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(filteredIds, function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                offsetYAxis = 0;
                return getLethalityRate(d);
            } else {
                return data[selectedDate][d][selectedMetric] !== null ? data[selectedDate][d][selectedMetric] : 0;
            }
        }) + offsetYAxis])
        .range([height, 0]);

    if (selectedMetric === Metric.LETHALITY_RATE) {
        svg.append('g')
            .call(d3.axisLeft(y).ticks(5, 'f').tickFormat(formatPercent));
    } else {
        svg.append('g')
            .call(d3.axisLeft(y).ticks(5, 'f'));
    }


    // text label for the y axis
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left - 14)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(getMetricsText());

    //hover div
    var hoverPopup = d3.select('#scatter-plot').append('div')
        .attr('id', 'plot-hover')
        .attr('class', 'popup');

    var clickPopup = d3.select('#scatter-plot').append('div')
        .attr('id', 'plot-click')
        .attr('class', 'popup');


    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        })
    }
    svg.append('g')
        .selectAll('dot')
        .data(filteredIds)
        .enter()
        .append('circle')
        .attr('id', function (d) {
            return '' + d;
        })
        .attr('name', function (d) {
            return counties[d].name;
        })
        .attr('cy', function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return y(getLethalityRate(d));
            } else {
                return y(data[selectedDate][d][selectedMetric]);
            }
        })
        .attr('cx', function (d) {
            return x(counties[d].density);
        })
        .attr('r', function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return 3;
            } else {
                return data[selectedDate][d][selectedMetric] == null ? 0 : 3;
            }
        })
        .style('fill', function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return getColor(getLethalityRate(d));
            } else {
                if (data[selectedDate][d][selectedMetric] !== 0) {
                    return getColor(data[selectedDate][d][selectedMetric])
                }
            }
            return 'white';
        })
        .style('stroke', 'black')
        .style('stroke-width', function (d) {
            if (selectedCountyId === d) {
                clickPopup.style('display', 'inline')
                    .style('left', (this.getBBox().x + margin.left) + 'px')
                    .style('top', (this.getBBox().y + margin.top - 25) + 'px')
                    .html(countyNames[this.id]);
                d3.select(this).moveToFront();
                return d3.select(this).style('stroke-width', 3);
            }
            return d3.select(this).style('stroke-width', 1);
        })
        .on('mousemove', function () {
            hoverPopup.style('display', 'inline');
        })
        .on('mouseover', function (d) {
            hoverPopup.moveToFront();
            hoverPopup.style('left', (d.layerX) + 'px')
                .style('top', (d.layerY - 40) + 'px')
                .html(countyNames[this.id]);

            d3.select(this).style('stroke-width', 3);
        })
        .on('mouseout', function () {
            hoverPopup.style('display', 'none');
            if (selectedCountyId !== this.id) {
                d3.select(this).style('stroke-width', 1);
            }
        })
        .on('click', function () {
            document.getElementById('i' + this.id).dispatchEvent(new Event('click', {bubbles: true}));
        });
}

function getMetricsText() {
    var text = '';
    switch (selectedMetric) {
        case Metric.NEW_CASES:
            text = 'Neuinfektionen';
            break;
        case Metric.NEW_DEATHS:
            text = 'neue Todesfälle';
            break;
        case Metric.TOTAL_CASES:
            text = 'Infektionen';
            break;
        case Metric.TOTAL_DEATHS:
            text = 'Gesamtzahl Todesfälle';
            break;
        case Metric.CASE_INCIDENCE:
            text = '7-Tage-Inzidenz Neuinfektionen';
            break;
        case Metric.LETHALITY_RATE:
            text = 'Letalitätsrate';
            break;
    }
    return text;
}
