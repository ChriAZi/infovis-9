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
            baseColor: '#ffea4c',
            scaleStartColor: '#ffea4c',
            scaleEndColor: '#6c067e'
        },
        'newDeaths': {
            valueRange: [],
            baseColor: '#333333',
            scaleStartColor: '#eaeaeb',
            scaleEndColor: '#eaeaeb'
        },
        'totalDeaths': {
            valueRange: [],
            baseColor: '#002ea3',
            scaleStartColor: '#6879a1',
            scaleEndColor: '#002ea3'
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
        Metric.properties[metric].valueRange = getMinMax(metric);
    }
}

function getMinMax(metric) {
    let tmpMin, tmpMax;
    tmpMin = tmpMax = 0;
    for (let date in data) {
        for (let county in data[date]) {
            let val;
            if (metric === Metric.LETHALITY_RATE) {
                val = getLethalityRate(county, date)
            } else {
                val = data[date][county][metric];
            }
            if (val < tmpMin) tmpMin = val;
            if (val > tmpMax) tmpMax = val;
        }
    }
    return [tmpMin, tmpMax];
}

function getColor(value) {
    let scalingFactor;
    switch (selectedMetric) {
        case Metric.NEW_DEATHS:
            scalingFactor = 5000;
            break;
        case Metric.CASE_INCIDENCE:
            scalingFactor = 4;
            break;
        case Metric.LETHALITY_RATE:
            scalingFactor = 0.5;
            break;
        default:
            scalingFactor = 500;
    }
    let scale = d3.scaleLinear()
        .domain([Metric.properties[selectedMetric].valueRange[0], (Metric.properties[selectedMetric].valueRange[1] / scalingFactor)])
        .range([Metric.properties[selectedMetric].scaleStartColor, Metric.properties[selectedMetric].scaleEndColor]);
    return scale(value);
}

function getLethalityRate(totalOrCounty, date = selectedDate) {
    return (data[date][totalOrCounty][Metric.TOTAL_DEATHS] / data[date][totalOrCounty][Metric.TOTAL_CASES]);
}