const Metric = {
    NEW_CASES: 'newCases',
    TOTAL_CASES: 'totalCases',
    NEW_DEATHS: 'newDeaths',
    TOTAL_DEATHS: 'totalDeaths',
    CASE_INCIDENCE: 'caseIncidence',
    LETHALITY_RATE: 'lethalityRate',
    properties: {
        'newCases': {
            name: "Neue Infektionen",
            valueRange: [],
            scaledMax: 0,
            baseColor: '#ffaa00',
            scaleStartColor: '#fee3ab',
            scaleEndColor: '#ffaa00',
            valueSteps: []
        },
        'totalCases': {
            name: "Infektionen",
            valueRange: [],
            scaledMax: 0,
            baseColor: '#FDE725',
            scaleStartColor: '#ffea4c',
            scaleEndColor: '#3D0154',
            valueSteps: []
        },
        'newDeaths': {
            name: "Neue Todesfälle",
            valueRange: [],
            scaledMax: 0,
            baseColor: '#5A5EC8',
            scaleStartColor: '#BDE1EA',
            scaleEndColor: '#5A5EC8',
            valueSteps: []
        },
        'totalDeaths': {
            name: "Todesfälle",
            valueRange: [],
            scaledMax: 0,
            baseColor: '#333333',
            scaleStartColor: '#eaeaeb',
            scaleEndColor: '#333333',
            valueSteps: []
        },
        'caseIncidence': {
            name: "7-Tage-Inzidenz",
            valueRange: [],
            scaledMax: 0,
            baseColor: '#78121e',
            scaleStartColor: '#ffb753',
            scaleEndColor: '#78121e',
            valueSteps: []
        },
        'lethalityRate': {
            name: "Letalitätsrate",
            valueRange: [],
            scaledMax: 0,
            baseColor: '#3f007d',
            scaleStartColor: '#8ab670',
            scaleEndColor: '#de0000',
            valueSteps: []
        },
        'icuBeds': {
            'occupied': {
                name: 'Belegte Intensivbetten',
                color: '#FFA687'
            },
            'free': {
                name: 'Freie Intensivbetten',
                color: '#F5F5F5'
            },
            'reserve': {
                name: 'Notfallreserve',
                color: '#e2efd4'
            }
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
    initScatterPlot();
    initAreaChart().then(() => {
        initLegends(Legend.MAP);
        initLegends(Legend.SCATTER);
        initLegends(Legend.AREA);
    });
    initSlider();
    initDashboard();
}

function updateAll() {
    updateMap();
    initScatterPlot();
    updateAreaChart();
    updateLegends(Legend.MAP);
    updateLegends(Legend.SCATTER);
    updateLegends(Legend.AREA);
    updateMetrics();
}

function setMinMaxValuesForMetricObject() {
    for (let metric in Metric.properties) {
        if (metric !== 'icuBeds') {
            if (metric !== 'all') {
                Metric.properties[metric].valueRange = getMinMaxInCounties(metric);
                Metric.properties[metric].valueSteps = getValueStepsInCounties(metric);
            }
        }
    }
}

function getMinMaxInCounties(metric) {
    let tmpMin, tmpMax, scaledMax;
    tmpMin = tmpMax = 0;
    for (let date in data) {
        for (let county in data[date]) {
            if (county !== 'all') {
                let val;
                if (metric === Metric.LETHALITY_RATE) {
                    val = getLethalityRate(county, date);
                } else {
                    val = data[date][county][metric];
                }
                if (val < tmpMin) tmpMin = val;
                if (val > tmpMax) {
                    tmpMax = val;
                    scaledMax = scaleByPopulation(val, county);
                }
            }
        }
    }
    Metric.properties[metric].scaledMax = scaledMax;
    return [tmpMin, tmpMax];
}

function getValueStepsInCounties(metric, steps = 5) {
    let unsortedList = [];
    for (let date in data) {
        for (let county in data[date]) {
            if (county !== 'all'){
                if(metric === "lethalityRate" && data[date][county]['totalDeaths'] > 1){
                    unsortedList.push(getLethalityRate(county,date));
                }else if(data[date][county][metric] > 1){
                    unsortedList.push(data[date][county][metric]);
                }
            }
        }
    }
    let sortedList = unsortedList.sort((a,b) => a-b);
    let valueSteps = [], cuttingEdge, slicingRate = 2, roundTo = 1;
    switch(metric){
        case "newCases":
            slicingRate = 1.4;
            roundTo = 10;
            break;
        case 'totalCases':
            slicingRate = 2.8
            roundTo = 100;
            break;
        case 'newDeaths':
            slicingRate = 1.5;
            break;
        case 'totalDeaths':
            slicingRate = 1.7;
            roundTo = 10;
            break;
        case 'caseIncidence':
            slicingRate = 1.5;
            roundTo = 10;
            break;
        case 'lethalityRate':
            slicingRate = 1.05;
            roundTo = 1;
            valueSteps.unshift(sortedList[sortedList.length-1]);
            for(let i = 0; i < steps-1; i++) {
                cuttingEdge = Math.floor(sortedList.length/slicingRate);
                valueSteps.unshift(sortedList[cuttingEdge]);
                sortedList = sortedList.slice(0, cuttingEdge);
                slicingRate += 0.2;
            }
            valueSteps.unshift(0);
            return valueSteps;
        }
    valueSteps.push(0);
    for(let i = 0; i < steps-1; i++) {
        cuttingEdge = Math.floor(sortedList.length/slicingRate);
        valueSteps.push(Math.round(sortedList[cuttingEdge]/roundTo)*roundTo);
        sortedList = sortedList.slice(cuttingEdge+1,sortedList.length-1);
    }
    valueSteps.push(Math.round(sortedList[sortedList.length-1]/roundTo)*roundTo);
    return valueSteps;
}

function getLethalityRate(totalOrCounty, date = selectedDate) {
    if (!+data[date][totalOrCounty][Metric.TOTAL_CASES]) {
        return 0;
    } else {
        return (data[date][totalOrCounty][Metric.TOTAL_DEATHS] / data[date][totalOrCounty][Metric.TOTAL_CASES]);
    }
}
