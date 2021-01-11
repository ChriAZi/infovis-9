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
        setDefaultDashboardValues();
    })
})

function updateDashboard(county) {
    $('.selected-location').html(county['GEN']);
    $('.metric.newCases').find('.metric-number').html(data[selectedDate][county['AGS']][Metric.NEW_CASES] || 'keine Daten');
    $('.metric.totalCases').find('.metric-number').html(data[selectedDate][county['AGS']][Metric.TOTAL_CASES] || 'keine Daten');
    $('.metric.newDeaths').find('.metric-number').html(data[selectedDate][county['AGS']][Metric.NEW_DEATHS] || 'keine Daten');
    $('.metric.totalDeaths').find('.metric-number').html(data[selectedDate][county['AGS']][Metric.TOTAL_DEATHS] || 'keine Daten');
    $('.metric.caseIncidence').find('.metric-number').html(data[selectedDate][county['AGS']][Metric.CASE_INCIDENCE] || 'keine Daten');
    $('.metric.deathIncidence').find('.metric-number').html(data[selectedDate][county['AGS']][Metric.DEATH_INCIDENCE] || 'keine Daten');
    $('.back-to-all-data').css('opacity', '1');
    setCounty(county['AGS']);
}

function setDefaultDashboardValues() {
    $('.selected-location').html('Deutschland');
    $('.metric.newCases').find('.metric-number').html(data[selectedDate]['all'][Metric.NEW_CASES] || 'keine Daten');
    $('.metric.totalCases').find('.metric-number').html(data[selectedDate]['all'][Metric.TOTAL_CASES] || 'keine Daten');
    $('.metric.newDeaths').find('.metric-number').html(data[selectedDate]['all'][Metric.NEW_DEATHS] || 'keine Daten');
    $('.metric.totalDeaths').find('.metric-number').html(data[selectedDate]['all'][Metric.TOTAL_DEATHS] || 'keine Daten');
    $('.metric.caseIncidence').find('.metric-number').html(data[selectedDate]['all'][Metric.CASE_INCIDENCE] || 'keine Daten');
    $('.metric.deathIncidence').find('.metric-number').html(data[selectedDate]['all'][Metric.DEATH_INCIDENCE] || 'keine Daten');
    $('.metric-date').html('Stand: ' + getDateInFormat(selectedDate));
    $('.back-to-all-data').css('opacity', '0');
    setCounty(null);
    removeSelection();
}

function updateMetrics() {
    let metricScope = selectedCountyId || 'all';
    $('.metric.newCases').find('.metric-number').html(data[selectedDate][metricScope][Metric.NEW_CASES] || 'keine Daten');
    $('.metric.totalCases').find('.metric-number').html(data[selectedDate][metricScope][Metric.TOTAL_CASES] || 'keine Daten');
    $('.metric.newDeaths').find('.metric-number').html(data[selectedDate][metricScope][Metric.NEW_DEATHS] || 'keine Daten');
    $('.metric.totalDeaths').find('.metric-number').html(data[selectedDate][metricScope][Metric.TOTAL_DEATHS] || 'keine Daten');
    $('.metric.caseIncidence').find('.metric-number').html(data[selectedDate][metricScope][Metric.CASE_INCIDENCE] || 'keine Daten');
    $('.metric.deathIncidence').find('.metric-number').html(data[selectedDate][metricScope][Metric.DEATH_INCIDENCE] || 'keine Daten');
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