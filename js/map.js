var min = 0;
var max = 0;

function updateMap() {
    [min, max] = getMinMax(selectedMetric);
    //color path fill based on data
    d3.select('#map').selectAll('path').nodes().forEach(function (d) {
        var str = (d.id).substring(1);
        if (Object.keys(data[selectedDate]).includes(str) && data[selectedDate][str][selectedMetric] !== 0) {
            var val = data[selectedDate][str][selectedMetric];
            d3.select(d).style('fill', getColor(val));
        } else {
            d3.select(d).style('fill', 'white')
        }
    });
}

function initMap() {
    [min, max] = getMinMax(selectedMetric);
    var svg = d3.select('#map');
    let map = $('#map');

    var width = map.parent().width(),
        height = map.parent().height();

    // Map and projection
    var projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], geoData);

    svg.append('g')
        .selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('fill', function (d) {
            if (Object.keys(data[selectedDate]).includes(d.properties.AGS) && data[selectedDate][d.properties.AGS][selectedMetric] !== 0) {
                return getColor(data[selectedDate][d.properties.AGS][selectedMetric])
            }
            return 'white'
        })
        .attr('id', function (d) {
            return 'i' + d.properties.AGS;
        })
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .style('stroke', 'black')
        .on('mouseover', function () {
            // todo handle popup info
        })
        .on('mouseout', function () {
            // todo handle popup info
        })
        .on('click', function (d) {
                removeSelection();
                d3.select('#infoText').text(this.id);
                updateDashboard(d.target.__data__.properties);
                this.classList.add('selected-county');
            }
        );
}
