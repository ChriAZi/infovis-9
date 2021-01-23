const numberOfLegendItems = 5;

const Legend = {
    MAP: 'mapLegend',
    SCATTER: 'scatterLegend',
    AREA: 'areaLegend',
    properties: {
        'mapLegend': {
            isShown: true
        },
        'scatterLegend': {
            isShown: true
        },
        'areaLegend': {
            isShown: true
        }
    }
};
Object.freeze(Legend);

function initLegends(legend, rerender) {
    let svg, labels, offsetX, offsetY, distanceBetweenCircles, radiusCircle;
    switch (legend) {
        case Legend.MAP:
            svg = d3.select('#map')
                .append('svg')
                .attr('id', 'mapLegend');
            [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing(legend);
            break;
        case Legend.SCATTER:
            svg = d3.select('#scatter-plot-svg')
                .append('svg')
                .attr('id', 'scatterLegend');
            [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing(legend);
            offsetX = $('#scatter-plot').width() - offsetX;
            break;
        case Legend.AREA:
            svg = d3.select('#area-chart')
                .append('svg')
                .attr('id', 'areaLegend');
            labels = ['Belegte Betten', 'Freie Betten', 'Notfallreserve'];
            [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing(legend);
            break;
    }
    let valueSteps = getValueSteps();

    // todo area Chart logic
    svg.selectAll('circle')
        .data(valueSteps)
        .enter()
        .append('circle')
        .attr('cx', offsetX)
        .attr('cy', function (d, i) {
            return offsetY + i * distanceBetweenCircles
        })
        .attr('r', radiusCircle)
        .attr('fill', function (d) {
            return getColor(d)
        });

    // todo area Chart logic
    svg.selectAll('text')
        .data(valueSteps)
        .enter()
        .append('text')
        .attr('dominant-baseline', 'central')
        .attr('x', (offsetX + radiusCircle + 7.5))
        .attr('y', function (d, i) {
            return (offsetY + i * distanceBetweenCircles)
        })
        .text((d, i) => {
            if (legend === Legend.AREA) {
                return labels[i];
            } else {
                if (selectedMetric === Metric.LETHALITY_RATE) {
                    return d.toString().replace(/\./g, ',') + '%';
                } else if (selectedMetric === Metric.CASE_INCIDENCE) {
                    return d.toString().replace(/\./g, ',');
                } else {
                    return getNumberWithDots(d)
                }
            }
        })
    if (!rerender) {
        svg.style('opacity', 1);
    } else {
        if (Legend.properties[legend].isShown) {
            svg.style('opacity', 1);
        } else {
            svg.style('opacity', 0);
        }
    }
}

function toggleLegends(legend) {
    if (Legend.properties[legend].isShown === true) {
        $(('#' + legend).toString()).css('opacity', 0);
        Legend.properties[legend].isShown = false;
    } else {
        $(('#' + legend).toString()).css('opacity', 1);
        Legend.properties[legend].isShown = true;
    }
}

function updateLegends(legend) {
    switch (legend) {
        case Legend.MAP:
            updateMapLegend();
            break;
        case Legend.SCATTER:
            initLegends(Legend.SCATTER, true);
            break;
        case Legend.AREA:
            initLegends(Legend.AREA, true);
            break;
    }
}

function updateMapLegend() {
    let svg = d3.select('#mapLegend');
    svg.selectAll('circle')
        .data(getValueSteps())
        .style('fill', (d) => getColor(d));

    svg.selectAll('text')
        .data(getValueSteps())
        .text((d) => {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return d.toString().replace(/\./g, ',') + '%';
            } else {
                return getNumberWithDots(d);
            }
        });
}


function getValueSteps(isAreaLegend = false) {
    if (!isAreaLegend) {
        let min = Metric.properties[selectedMetric].valueRange[0];
        let max = Metric.properties[selectedMetric].valueRange[1];
        if (selectedMetric === Metric.LETHALITY_RATE) {
            min = Metric.properties[selectedMetric].valueRange[0] * 100;
            max = Metric.properties[selectedMetric].valueRange[1] * 100;
        }
        let difMinMax = max - min;
        let stepsForLegend = [];
        let numberSteps = numberOfLegendItems - 1;
        let step = difMinMax / (numberSteps);
        for (let i = 0; i < numberSteps; i++) {
            stepsForLegend.push(Math.round((min + i * step) / 10) * 10);
        }
        stepsForLegend.push(Math.round(max));
        return stepsForLegend;
    } else {
        // todo area Chart logic
    }
}

function getRelativeSizing(legend) {
    let offsetX, offsetY, distanceBetweenCircles, radiusCircle;
    switch (legend) {
        case Legend.MAP:
            offsetX = 1.5 * (document.documentElement.clientHeight / 100);
            offsetY = 1.5 * (document.documentElement.clientHeight / 100);
            distanceBetweenCircles = 2.5 * (document.documentElement.clientHeight / 100);
            radiusCircle = (document.documentElement.clientHeight / 100);
            break;
        case Legend.SCATTER:
            offsetX = 15 * (document.documentElement.clientHeight / 100);
            offsetY = 3 * (document.documentElement.clientHeight / 100);
            distanceBetweenCircles = 2.5 * (document.documentElement.clientHeight / 100);
            radiusCircle = (document.documentElement.clientHeight / 100);
            break;
        case Legend.AREA:
            offsetX = 1.5 * (document.documentElement.clientHeight / 100);
            offsetY = 1.5 * (document.documentElement.clientHeight / 100);
            distanceBetweenCircles = 2.5 * (document.documentElement.clientHeight / 100);
            radiusCircle = (document.documentElement.clientHeight / 100);
            break;
    }
    return [offsetX, offsetY, distanceBetweenCircles, radiusCircle];
}

