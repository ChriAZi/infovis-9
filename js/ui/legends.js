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
    let svg, previousSvg, labels;
    switch (legend) {
        case Legend.MAP:
            previousSvg = $('#mapLegend');
            if (previousSvg) {
                previousSvg.remove();
            }
            svg = d3.select('#map')
                .append('svg')
                .attr('id', 'mapLegend');
            constructLegend(svg, legend);
            break;
        case Legend.SCATTER:
            previousSvg = $('#scatterLegend');
            if (previousSvg) {
                previousSvg.remove();
            }
            svg = d3.select('#scatter-plot-svg')
                .append('svg')
                .attr('id', 'scatterLegend');
            constructLegend(svg, legend);
            break;
        case Legend.AREA:
            previousSvg = $('#areaLegend');
            if (previousSvg) {
                previousSvg.remove();
            }
            svg = d3.select('#area-chart-svg')
                .append('svg')
                .attr('id', 'areaLegend');
            labels = ['Belegte Betten', 'Freie Betten', 'Notfallreserve'];
            [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing(legend);
            break;
    }
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

function constructLegend(svg, legend) {
    let valueSteps = getValueSteps(legend);
    let [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing(legend);
    if (legend === Legend.SCATTER) {
        offsetX = $('#scatter-plot').width() - offsetX;
    }
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

    svg.selectAll('text')
        .data(valueSteps)
        .enter()
        .append('text')
        .attr('dominant-baseline', 'central')
        .attr('x', (offsetX + radiusCircle + 7.5))
        .attr('y', function (d, i) {
            return (offsetY + i * distanceBetweenCircles)
        })
        .text((d) => {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return d.toString().replace(/\./g, ',') + '%';
            } else if (selectedMetric === Metric.CASE_INCIDENCE) {
                return d.toString().replace(/\./g, ',');
            } else {
                return getNumberWithDots(d)
            }
        })
}

function toggleLegends(legend) {
    if (Legend.properties[legend].isShown === true) {
        $(('#' + legend).toString()).css('opacity', 0);
        Legend.properties[legend].isShown = false;
        console.log('hidden');
    } else {
        $(('#' + legend).toString()).css('opacity', 1);
        Legend.properties[legend].isShown = true;
        console.log('shown');
    }
}

function updateLegends(legend) {
    switch (legend) {
        case Legend.MAP:
            initLegends(Legend.MAP, true);
            break;
        case Legend.SCATTER:
            initLegends(Legend.SCATTER, true);
            break;
        case Legend.AREA:
            initLegends(Legend.AREA, true);
            break;
    }
}

function getValueSteps(legend) {
    if (legend === Legend.MAP || legend === Legend.SCATTER) {
        let numberOfLegendItems = 5;
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
            offsetX = 2 * (document.documentElement.clientHeight / 100);
            offsetY = 2 * (document.documentElement.clientHeight / 100);
            distanceBetweenCircles = 2.5 * (document.documentElement.clientHeight / 100);
            radiusCircle = (document.documentElement.clientHeight / 100);
            break;
    }
    return [offsetX, offsetY, distanceBetweenCircles, radiusCircle];
}

