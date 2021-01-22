const Metric = {
    NEW_CASES: 'newCases',
    TOTAL_CASES: 'totalCases',
    NEW_DEATHS: 'newDeaths',
    TOTAL_DEATHS: 'totalDeaths',
    CASE_INCIDENCE: 'caseIncidence',
    LETHALITY_RATE: 'lethalityRate',
    properties: {
        'newCases': {
            valueRange: [],
            baseColor: '#ffaa00',
            scaleStartColor: '#fee3ab',
            scaleEndColor: '#ffaa00'
        },
        'totalCases': {
            valueRange: [],
            baseColor: '#3D0154',
            scaleStartColor: '#ffea4c',
            scaleEndColor: '#3D0154'
        },
        'newDeaths': {
            valueRange: [],
            baseColor: '#5A5EC8',
            scaleStartColor: '#BDE1EA',
            scaleEndColor: '#5A5EC8'
        },
        'totalDeaths': {
            valueRange: [],
            baseColor: '#333333',
            scaleStartColor: '#eaeaeb',
            scaleEndColor: '#333333'
        },
        'caseIncidence': {
            valueRange: [],
            baseColor: '#78121e',
            scaleStartColor: '#ffb753',
            scaleEndColor: '#78121e'
        },
        'lethalityRate': {
            valueRange: [],
            baseColor: '#de0000',
            scaleStartColor: '#8ab670',
            scaleEndColor: '#de0000'
        }
    }
};
Object.freeze(Metric);

var selectedMetric = Metric.CASE_INCIDENCE;
var selectedCountyId = null;
var selectedDate = null;

function setMetric(metric) {

    selectedMetric = metric;
    updateAll();
}

function setCounty(id) {
    selectedCountyId = id;
    updateAll();
}

function setDate(date) {
    selectedDate = date;
    updateAll();
}

function onDataLoaded() {
    // select latest date (last element in sorted data)
    selectedDate = Object.keys(data)[Object.keys(data).length - 1];
    // needs to happen before loading visualizations
    setMinMaxValuesForMetricObject();
    initMap();
    initMapLegend();
    initScatterPlot();
    initAreaChart();
    initSlider();
    initDashboard();
}

function updateAll() {
    updateMap();
    updateMapLegend();
    initScatterPlot();
    updateAreaChart();
    updateMetrics();
}

function setMinMaxValuesForMetricObject() {
    for (let metric in Metric.properties) {
        if (metric !== 'all') {
            Metric.properties[metric].valueRange = getMinMaxInCounties(metric);
        }
    }
}

function getMinMaxInCounties(metric) {
    let tmpMin, tmpMax;
    tmpMin = tmpMax = 0;
    let test;
    for (let date in data) {
        for (let county in data[date]) {
            if (county !== 'all') {
                let val;
                if (metric === Metric.LETHALITY_RATE) {
                    val = getLethalityRate(county, date)
                } else {
                    val = data[date][county][metric];
                }
                if (val < tmpMin) tmpMin = val;
                if (val > tmpMax) {
                    tmpMax = val;
                    if (metric === Metric.TOTAL_CASES) {
                        test = county;
                    }
                }
            }
        }
    }
    return [tmpMin, tmpMax];
}

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
                .domain([min, (max / scalingFactor)])
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

function getLethalityRate(totalOrCounty, date = selectedDate) {
    if (!+data[date][totalOrCounty][Metric.TOTAL_CASES]) {
        return 0;
    } else {
        return (data[date][totalOrCounty][Metric.TOTAL_DEATHS] / data[date][totalOrCounty][Metric.TOTAL_CASES]);
    }
}
