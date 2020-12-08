const Metric = {
    NEW_CASES: "newCases",
    NEW_DEATHS: "newDeaths",
    TOTAL_CASES: "totalCases",
    TOTAL_DEATHS: "totalDeaths",
    CASE_INCIDENCE: "caseIncidence",
    DEATH_INCIDENCE: "deathIncidence",
    FREE_BEDS: "freeBeds",
    OCCUPIED_BEDS: "occupiedBeds",
    MORTALITY_RATE: "mortalityRate",
    BED_CAPACITY: "bedCapacity",
};
Object.freeze(Metric);

var selectedMetric = Metric.NEW_CASES;
var selectedCountyId = null;
var selectedDate = null;

function setMetric(metric) {
    selectedMetric = metric;
    updateAll();
};

function setCounty(id) {
    selectedCountyId = id;
    // TODO: updateMap()
    // TODO: updateAreaChart()
    // TODO: updateScatterPlot()
};

function setDate(date) {
    selectedDate = date;
    // TODO: updateMap()
    // TODO: updateAreaChart()
    // TODO: updateScatterPlot()
};

function updateAll() {
    // TODO: updateMetricSelection()
    // TODO: updateMap()
    // TODO: updateAreaChart()
    // TODO: updateScatterPlot()
}
