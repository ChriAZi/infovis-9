$(document).ready(function () {
    // Handle Metric Selection
    $('.selection').click(function () {
        let element = $(this);
        if (element.hasClass('isSelected')) return;
        $('.selection.isSelected').removeClass('isSelected');
        element.addClass('isSelected');
        let metric = element.parent().attr('class').split(/\s+/)[2];
        setMetric(metric);
    })

    $('.back-to-all-data').click(function () {
        updateMetricsForGermany();
    })
})

const UpdateConfig = {
    COUNTY: 'county',
    TOTAL: 'total',
    GENERAL: 'general'
}
Object.freeze(UpdateConfig)

let selectedConfig = UpdateConfig.TOTAL;

function initDashboard() {
    $('.selected-location').html('Deutschland');
    selectedConfig = UpdateConfig.TOTAL;
    updateMetricElements();
    $('.metric-date').html('Stand: ' + getDateInFormat(selectedDate));
    $('.back-to-all-data').css('opacity', '0');
}

function updateMetricsForSelectedCounty(county) {
    $('.selected-location').html(county['GEN']);
    selectedConfig = UpdateConfig.COUNTY;
    updateMetricElements(county);
    $('.back-to-all-data').css('opacity', '1');
    setCounty(county['AGS']);
}

function updateMetricsForGermany() {
    $('.selected-location').html('Deutschland');
    selectedConfig = UpdateConfig.TOTAL;
    updateMetricElements();
    $('.back-to-all-data').css('opacity', '0');
    setCounty(null);
    removeCountySelectionOnMap();
}

function updateMetrics() {
    selectedConfig = UpdateConfig.GENERAL;
    updateMetricElements();
}

function removeCountySelectionOnMap() {
    let countySelection = $('#map').find('.selected-county');
    if (countySelection[0]) {
        countySelection[0].style.stroke = 'var(--background-dark-grey)';
        countySelection[0].style.strokeWidth = '0.5px';
        countySelection[0].classList.remove('selected-county');
    }
    let clickPopup = $('.map-container').find('.click-popup');
    if (clickPopup[0].style.display === 'inline') {
        clickPopup[0].style.display = 'none';
    }
}

function getDateInFormat(date) {
    let parseDateFromData = d3.timeParse('%Y/%m/%d');
    let readableDateParser = d3.timeFormat('%d.%m.%Y');
    return readableDateParser(parseDateFromData(date));
}

function updateMetricElements(county) {
    let config;
    switch (selectedConfig) {
        case UpdateConfig.COUNTY:
            config = county['AGS'];
            break;
        case UpdateConfig.TOTAL:
            config = 'all'
            break;
        case UpdateConfig.GENERAL:
            config = selectedCountyId || 'all';
            break;
        default:
            config = selectedCountyId || 'all';
    }
    let newCases = getNumberWithDots(data[selectedDate][config][Metric.NEW_CASES]);
    let totalCases = getNumberWithDots(data[selectedDate][config][Metric.TOTAL_CASES]);
    let newDeaths = getNumberWithDots(data[selectedDate][config][Metric.NEW_DEATHS]);
    let totalDeaths = getNumberWithDots(data[selectedDate][config][Metric.TOTAL_DEATHS]);
    let caseIncidence = (Math.round(data[selectedDate][config][Metric.CASE_INCIDENCE] * 10) / 10).toString().replace(/\./g, ',');
    let lethalityRate = (Math.round(((getLethalityRate(config) * 100) + Number.EPSILON) * 100) / 100).toString().replace(/\./g, ',') + '%';

    $('.metric.newCases').find('.metric-number').html(newCases === null ? 'keine Daten' : newCases);
    $('.metric.totalCases').find('.metric-number').html(totalCases === null ? 'keine Daten' : totalCases);
    $('.metric.newDeaths').find('.metric-number').html(newDeaths === null ? 'keine Daten' : newDeaths);
    $('.metric.totalDeaths').find('.metric-number').html(totalDeaths === null ? 'keine Daten' : totalDeaths);
    $('.metric.caseIncidence').find('.metric-number').html(caseIncidence === null ? 'keine Daten' : caseIncidence);
    $('.metric.lethalityRate').find('.metric-number').html(lethalityRate === null ? 'keine Daten' : lethalityRate);

function getNumberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getMetricsText() {
    let text = '';
    switch (selectedMetric) {
        case Metric.NEW_CASES:
            text = 'Neuinfektionen pro 100.000 EW';
            break;
        case Metric.NEW_DEATHS:
            text = 'Neue Todesfälle pro 100.000 EW';
            break;
        case Metric.TOTAL_CASES:
            text = 'Infektionen pro 100.000 EW';
            break;
        case Metric.TOTAL_DEATHS:
            text = 'Todesfälle pro 100.000 EW';
            break;
        case Metric.CASE_INCIDENCE:
            text = '7-Tage-Inzidenz Neuinfektionen';
            break;
        case Metric.LETHALITY_RATE:
            text = 'Letalitätsrate';
            break;
    }
    return text;
}