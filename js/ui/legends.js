const numberPoints = 5;
let [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing();
let svgMapLegend;
let mapLegendIsShown = true;

function initMapLegend() {
    [offsetX, offsetY, distanceBetweenCircles, radiusCircle] = getRelativeSizing();
    let stepsForLegend = getStepsForLegend();
    svgMapLegend = d3.select('#map')
        .append('svg')

    svgMapLegend.selectAll('circle')
        .data(stepsForLegend)
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

    svgMapLegend.selectAll('text')
        .data(stepsForLegend)
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
                getNumberWithDots(d)
            }
        })
    svgMapLegend.style('opacity', 1);
}

function showHideMapLegend() {
    if (mapLegendIsShown) {
        svgMapLegend.style('opacity', 0);
        mapLegendIsShown = false;
    } else {
        svgMapLegend.style('opacity', 1);
        mapLegendIsShown = true;
    }
}

function updateMapLegend() {
    svgMapLegend.selectAll('circle')
        .data(getStepsForLegend())
        .style('fill', (d) => getColor(d));
    svgMapLegend.selectAll('text')
        .data(getStepsForLegend())
        .text((d) => {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return d.toString().replace(/\./g, ',') + '%';
            } else {
                return getNumberWithDots(d);
            }
        });
}


function getStepsForLegend() {
    let min = Metric.properties[selectedMetric].valueRange[0];
    let max = Metric.properties[selectedMetric].valueRange[1];
    if (selectedMetric === Metric.LETHALITY_RATE) {
        min = Metric.properties[selectedMetric].valueRange[0] * 100;
        max = Metric.properties[selectedMetric].valueRange[1] * 100;
    }
    let difMinMax = max - min;
    let stepsForLegend = [];
    let numberSteps = numberPoints - 1;
    let step = difMinMax / (numberSteps);
    for (let i = 0; i < numberSteps; i++) {
        stepsForLegend.push(Math.round((min + i * step) / 10) * 10);
    }
    stepsForLegend.push(Math.round(max));
    return stepsForLegend;
}

function getRelativeSizing() {
    const offsetX = 1.5 * (document.documentElement.clientHeight / 100);
    const offsetY = 1.5 * (document.documentElement.clientHeight / 100);
    const disCircles = 2.5 * (document.documentElement.clientHeight / 100);
    const radiusCircle = (document.documentElement.clientHeight / 100);
    return [offsetX, offsetY, disCircles, radiusCircle];
}


