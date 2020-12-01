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
var selectedCounty = null;
var selectedDate = null;   // TODO: get latest date from data set

function setMetric(metric) {
    selectedMetric = metric;
    // TODO: update metric selection buttons
    // TODO: update map
    // TODO: update area chart
    // TODO: update scatter plot
};

function setCounty(county) {
    selectedCounty = county;
    // TODO: update map
    // TODO: update area chart
    // TODO: update scatter plot
};

function setDate(date) {
    selectedDate = date;
    // TODO: update map
    // TODO: update area chart
    // TODO: update scatter plot
};