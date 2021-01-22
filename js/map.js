function updateMap() {
    //color path fill based on data
    d3.select('#map').selectAll('path').nodes().forEach(function (d) {
        var str = (d.id).substring(1);
        if (Object.keys(data[selectedDate]).includes(str) &&
            (data[selectedDate][str][selectedMetric] !== 0 || getLethalityRate(str) !== 0)) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                d3.select(d).style('fill', getColor(getLethalityRate(str)));
            } else {
                var val = data[selectedDate][str][selectedMetric];
                d3.select(d).style('fill', getColor(val));
            }
        } else {
            d3.select(d).style('fill', 'white');
        }
    });
}

function initMap() {
    // needed for window resize
    d3.select('#map').selectAll('*').remove();
    let svg = d3.select('#map');
    let map = $('#map');
    let strokeColor

    let width = map.parent().width(),
        height = map.parent().height();

    // Map and projection
    let projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], geoData);

    //hover div
    let div = d3.select('.map-container').append('div')
        .attr('class', 'popup');

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        })
    }

    svg.append('g')
        .selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('fill', function (d) {
            if (Object.keys(data[selectedDate]).includes(d.properties.AGS) &&
                (data[selectedDate][d.properties.AGS][selectedMetric] !== 0 || getLethalityRate(d.properties.AGS) !== 0)) {
                if (selectedMetric === Metric.LETHALITY_RATE) {
                    return getColor(getLethalityRate(d.properties.AGS))
                } else {
                    // keep county selection while resizing
                    if (d.properties.AGS === selectedCountyId) {
                        this.classList.add('selected-county');
                    }
                    return getColor(data[selectedDate][d.properties.AGS][selectedMetric]);
                }
            }
            return 'white'
        })
        .attr('id', function (d) {
            return 'i' + d.properties.AGS;
        })
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .style('stroke', 'var(--background-dark-grey)')
        .style('stroke-width', '0.5px')
        .on('mousemove', function () {
            div.style('display', 'inline');
        })
        .on('mouseover', function (d) {
            div.moveToFront();
            div.style('left', (d.layerX) + 'px')
                .style('top', (d.layerY - 40) + 'px')
                .html(d.target.__data__.properties['GEN']);
            let pathStyles = d.target.attributes['style'].value.split(';');
            let rgbInStyles = pathStyles.filter(s => s.includes('rgb'));
            if (rgbInStyles.length) {
                let rgbValue = rgbInStyles[0].substr(rgbInStyles[0].indexOf('rgb'));
                strokeColor = getHighContrastColor(rgbValue);
            } else {
                strokeColor = getHighContrastColor(d.target.attributes['fill'].value);
            }
            d3.select(this).style('stroke', strokeColor);
            d3.select(this).style('stroke-width', 2);
        })
        .on('mouseout', function () {
            div.style('display', 'none');
            d3.select(this).style('stroke', 'var(--background-dark-grey)');
            d3.select(this).style('stroke-width', 0.5);
        })
        .on('click', function (d) {
                if (this.classList.contains('selected-county')) {
                    removeCountySelectionOnMap();
                    updateMetricsForGermany();
                } else {
                    removeCountySelectionOnMap();
                    updateMetricsForSelectedCounty(d.target.__data__.properties);
                    this.classList.add('selected-county');
                }
            }
        );
}
