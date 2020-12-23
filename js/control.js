const Metric = {
    NEW_CASES: "newCases",
    NEW_DEATHS: "newDeaths",
    TOTAL_CASES: "totalCases",
    TOTAL_DEATHS: "totalDeaths",
    CASE_INCIDENCE: "caseIncidence",
    BED_CAPACITY: "bedCapacity",
    DEATH_INCIDENCE: "deathIncidence",
    FREE_BEDS: "freeBeds",
    OCCUPIED_BEDS: "occupiedBeds",
    MORTALITY_RATE: "mortalityRate",
    properties: {
        "newCases": {
            minValue: 0,
            maxValue: 100,
            baseColor: "#ffaa00",
            scaleStartColor: "#fee3ab",
            scaleEndColor: "#ffaa00"
        },
        "newDeaths": {
            minValue: 0,
            maxValue: 2,
            baseColor: "#333333",
            scaleStartColor: "#eaeaeb",
            scaleEndColor: "#eaeaeb"
        },
        "totalCases": {
            minValue: 0,
            maxValue: 2,
            baseColor: "#ffea4c",
            scaleStartColor: "#ffea4c",
            scaleEndColor: "#6c067e"
        },
        "totalDeaths": {
            minValue: 0,
            maxValue: 2,
            baseColor: "#002ea3",
            scaleStartColor: "#6879a1",
            scaleEndColor: "#002ea3"
        },
        "caseIncidence": {
            minValue: 0,
            maxValue: 2,
            baseColor: "#78121e",
            scaleStartColor: "#ffb753",
            scaleEndColor: "#78121e"
        },
        "bedCapacity": {
            minValue: 0,
            maxValue: 2,
            baseColor: "#de0000",
            scaleStartColor: "#8ab670",
            scaleEndColor: "#de0000"
        }
    }
};
Object.freeze(Metric);

var selectedMetric = Metric.NEW_CASES;
var selectedCountyId = null;
var selectedDate = null;

function setMetric(metric) {
    selectedMetric = metric;
    updateAll();
}

function setCounty(id) {
    selectedCountyId = id;
    // TODO: updateMap()
    // TODO: updateAreaChart()
    // TODO: updateScatterPlot()
}

function setDate(date) {
    selectedDate = date;
    // TODO: updateMap()
    // TODO: updateAreaChart()
    // TODO: updateScatterPlot()
}

function onDataLoaded() {
    // select latest date (last element in sorted data)
    selectedDate = Object.keys(data)[Object.keys(data).length - 1];

    // TODO: initMap() or updateMap()
    // TODO: initAreaChart() or updateAreaChart()
    // TODO: initScatterPlot() or updateScatterPlot()
}

function updateAll() {
    // TODO: updateMetricSelection()
    // TODO: updateMap()
    // TODO: updateAreaChart()
    // TODO: updateScatterPlot()
}

function getColor(value) {
    let scale = d3.scaleLinear()
        .domain([Metric.properties[selectedMetric].minValue, Metric.properties[selectedMetric].maxValue])
        .range([Metric.properties[selectedMetric].scaleStartColor, Metric.properties[selectedMetric].scaleEndColor]);
    return scale(value);
}