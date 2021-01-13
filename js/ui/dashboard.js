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
    removeSelection();
}

function updateMetrics() {
    selectedConfig = UpdateConfig.GENERAL;
    updateMetricElements();
}

function removeSelection() {
    let prevElement = $('#map').find('.selected-county');
    if (prevElement[0]) {
        prevElement[0].classList.remove('selected-county');
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
    $('.metric.newCases').find('.metric-number').html(data[selectedDate][config][Metric.NEW_CASES] || 'keine Daten');
    $('.metric.totalCases').find('.metric-number').html(data[selectedDate][config][Metric.TOTAL_CASES] || 'keine Daten');
    $('.metric.newDeaths').find('.metric-number').html(data[selectedDate][config][Metric.NEW_DEATHS] || 'keine Daten');
    $('.metric.totalDeaths').find('.metric-number').html(data[selectedDate][config][Metric.TOTAL_DEATHS] || 'keine Daten');
    $('.metric.caseIncidence').find('.metric-number').html(Math.round(data[selectedDate][config][Metric.CASE_INCIDENCE] * 10) / 10 || 'keine Daten');
    $('.metric.deathIncidence').find('.metric-number').html(Math.round(data[selectedDate][config][Metric.DEATH_INCIDENCE] * 10) / 10 || 'keine Daten');
}