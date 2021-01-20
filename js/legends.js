const numberPoints = 5;
const offsetX = 10;
const offsetY = 10;
const disCircles = 15;
const radiusCircle = 5;
let svgMapLegend;

let MapLegendIsShown = false;

function initMapLegend(){
    /*scalingFactorColor = 500;
    switch (selectedMetric)
    {
        case Metric.NEW_CASES:
            break;
        case Metric.TOTAL_CASES:
            break;
        case Metric.NEW_DEATHS:
            scalingFactorColor = 5000;
            break;
        case Metric.TOTAL_DEATHS:
            break;
        case Metric.CASE_INCIDENCE:
            scalingFactorColor = 2;
            break;
        case Metric.DEATH_INCIDENCE:
            scalingFactorColor = 0.5;
            break;
    }*/
    let stepsForLegend = getStepsForLegend();
    svgMapLegend = d3.select("#map")
        .append("svg")

    svgMapLegend.selectAll("circle")
        .data(stepsForLegend)
        .enter()
        .append("circle")
        .attr("cx", offsetX)
        .attr("cy", function(d,i){return offsetY + i*disCircles})
        .attr("r", 5)
        .attr("fill", function(d){return getColor(d)});

    svgMapLegend.selectAll("text")
        .data(stepsForLegend)
        .enter()
        .append("text")
        .attr("x", (offsetX + 10))
        .attr("y", function(d,i){return (offsetY + i*disCircles+radiusCircle)})
        .text((d) => d)
        .append('style').text('text { font-family: var(--font-family)}')
        .append('style').text('text { font-size: var(--font-size-timeline)}')
        .append('style').text('text { color: var(--font-color)}');
    svgMapLegend.style("opacity", 0);
}

function showHideMapLegend() {
    if (MapLegendIsShown) {
        svgMapLegend.style("opacity", 0);
        MapLegendIsShown = false;
    } else{
        svgMapLegend.style("opacity", 1);
        MapLegendIsShown = true;
    }
}
function updateMapLegend(){
    svgMapLegend.selectAll('circle')
        .data(getStepsForLegend())
        .style('fill', (d) => getColor(d));
    svgMapLegend.selectAll("text")
        .data(getStepsForLegend())
        .text((d) => d);
}


function getStepsForLegend(){ //TODO Scaling Factor?
    let min = Metric.properties[selectedMetric].valueRange[0];
    let max = Metric.properties[selectedMetric].valueRange[1];
    let difMinMax = max - min;
    let stepsForLegend = [];
    let numberSteps = numberPoints-1;
    let step = difMinMax/(numberSteps);
    for(let i =0;i < numberSteps; i++){
        stepsForLegend.push(Math.round((min+i*step)/10)*10);
    }
    stepsForLegend.push(Math.round(max));
    return stepsForLegend;
}


