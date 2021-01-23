function getColor(value) {
    let scalingFactor, scale;
    let min = Metric.properties[selectedMetric].valueRange[0];
    let max = Metric.properties[selectedMetric].valueRange[1];
    let startColor = Metric.properties[selectedMetric].scaleStartColor;
    let endColor = Metric.properties[selectedMetric].scaleEndColor;
    switch (selectedMetric) {
        case Metric.NEW_CASES:
            scalingFactor = 10;
            scale = d3.scalePow()
                .exponent(2)
                .domain([min, (max / scalingFactor)])
                .range([startColor, endColor]);
            break;
        case Metric.TOTAL_CASES:
            scalingFactor = 50;
            scale = d3.scaleSequential()
                .interpolator(d3.interpolateViridis)
                .domain([(max / scalingFactor), (min)])
            break;
        case Metric.NEW_DEATHS:
            scalingFactor = 5;
            scale = getLinearScale(scalingFactor);
            break;
        case Metric.TOTAL_DEATHS:
            scalingFactor = 10;
            scale = getLinearScale(scalingFactor);
            break;
        case Metric.CASE_INCIDENCE:
            scalingFactor = 4;
            scale = getLinearScale(scalingFactor);
            break;
        case Metric.LETHALITY_RATE:
            scalingFactor = 10;
            scale = d3.scaleSequential()
                .interpolator(d3.interpolatePurples)
                .domain([min, (max / scalingFactor)])
    }
    return scale(value);

    function getLinearScale(scalingFactor) {
        return d3.scaleLinear()
            .domain([min, (max / scalingFactor)])
            .range([startColor, endColor]);
    }
}

function getHighContrastColor(color) {
    color = color.replace(/[^\d,]/g, '').split(',');
    let brightness = (299 * color[0] + 587 * color[1] + 114 * color[2]) / 1000
    if (brightness > 127) {
        return 'black';
    }
    return 'white';
}