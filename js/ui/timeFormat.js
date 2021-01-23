let germanFormatters = d3.timeFormatDefaultLocale({
    'decimal': ',',
    'thousands': '.',
    'grouping': [3],
    'currency': ['€', ''],
    'dateTime': '%a %b %e %X %Y',
    'date': '%d.%m.%Y',
    'time': '%H:%M:%S',
    'periods': ['AM', 'PM'],
    'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    'months': ['Jannuar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
});

var customTimeFormat = germanFormatters.timeFormat.multi([
    ['.%L', function (d) {
        return d.getMilliseconds();
    }],
    [':%S', function (d) {
        return d.getSeconds();
    }],
    ['%I:%M', function (d) {
        return d.getMinutes();
    }],
    ['%Hh', function (d) {
        return d.getHours();
    }],
    ['%B', function (d) {
        return d.getMonth();
    }],
    ['%Y', function () {
        return true;
    }]
]);