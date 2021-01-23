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
    let svg, previousSvg;
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
            constructLegend(svg, legend);
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
    switch (legend) {
        case Legend.MAP:
        case Legend.SCATTER:
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
                    if (d === 0) {
                        return 'white';
                    } else {
                        return getColor(d)
                    }
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
                    if (d === 0) {
                        return '0'
                    } else {
                        if (selectedMetric === Metric.LETHALITY_RATE) {
                            return '< ' + d.toString().replace(/\./g, ',') + '%';
                        } else if (selectedMetric === Metric.CASE_INCIDENCE) {
                            return '< ' + d.toString().replace(/\./g, ',');
                        } else {
                            return '< ' + getNumberWithDots(d)
                        }
                    }
                })
            break;
        case Legend.AREA:
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
                    if (!d.hasOwnProperty('color')) {
                        return Metric.properties[selectedMetric].baseColor;
                    } else {
                        return d.color
                    }
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
                    if (!d.hasOwnProperty('name')) {
                        return getMetricsText(selectedMetric);
                    } else {
                        return d.name
                    }
                })
            break;
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
    let stepsForLegend = [];
    switch (legend) {
        case Legend.MAP:
        case Legend.SCATTER:
            let numberOfLegendItems = 5;
            let min = Metric.properties[selectedMetric].valueRange[0];
            let max = Metric.properties[selectedMetric].valueRange[1];
            if (selectedMetric === Metric.LETHALITY_RATE) {
        min = Metric.properties[selectedMetric].valueRange[0] * 100;
        max = Metric.properties[selectedMetric].valueRange[1] * 100;
    }
    let difMinMax = max - min;

            let numberSteps = numberOfLegendItems - 1;
            let step = difMinMax / (numberSteps);
            for (let i = 0; i < numberSteps; i++) {
                stepsForLegend.push(Math.round((min + i * step) / 10) * 10);
            }
            stepsForLegend.push(Math.round(max));
            break;
        case Legend.AREA:
            for (let kindOfBed in Metric.properties.icuBeds) {
                stepsForLegend.push(Metric.properties.icuBeds[kindOfBed]);
            }
            stepsForLegend.push(selectedMetric);
            break;
    }
    return stepsForLegend;
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

