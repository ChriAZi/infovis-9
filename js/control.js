const Metric = {
    NEW_CASES: 'newCases',
    TOTAL_CASES: 'totalCases',
    NEW_DEATHS: 'newDeaths',
    TOTAL_DEATHS: 'totalDeaths',
    CASE_INCIDENCE: 'caseIncidence',
    DEATH_INCIDENCE: 'deathIncidence',
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
        'deathIncidence': {
            valueRange: [],
            baseColor: '#de0000',
            scaleStartColor: '#8ab670',
            scaleEndColor: '#de0000'
        }
    }
};
Object.freeze(Metric);

var selectedMetric = Metric.NEW_CASES;
var selectedCountyId = null;
var selectedDate = null;

var germanFormatters = d3.timeFormatDefaultLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["€", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    "months": ["Jannuar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
});

var customTimeFormat = germanFormatters.timeFormat.multi([
    [".%L", function(d) { return d.getMilliseconds(); }],
    [":%S", function(d) { return d.getSeconds(); }],
    ["%I:%M", function(d) { return d.getMinutes(); }],
    ["%Hh", function(d) { return d.getHours(); }],
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function() { return true; }]
]);

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
    initScatterPlot();
    initAreaChart();
    initSlider();
    initDashboard();
}

function updateAll() {
    updateMap();
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
    let keys = Object.keys(data[selectedDate]);
    let tmpMin, tmpMax;
    tmpMin = tmpMax = 0;
    keys.forEach(obj => {
        let val = data[selectedDate][obj][metric];
        if (val < tmpMin) {
            tmpMin = val;
        }
        if (val > tmpMax) {
            tmpMax = val;
        }
    })
    return [tmpMin, tmpMax];
}

function getColor(value) {
    let scalingFactor;
    switch (selectedMetric) {
        case Metric.NEW_DEATHS:
            scalingFactor = 5000;
            break;
        case Metric.CASE_INCIDENCE:
            scalingFactor = 2;
            break;
        case Metric.DEATH_INCIDENCE:
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