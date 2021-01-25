function updateMap() {
    //color path fill based on data
    d3.select('#map').selectAll('path').nodes().forEach(function (d) {
        let county = (d.id).substring(1);
        if (Object.keys(data[selectedDate]).includes(county)
            && data[selectedDate][county][selectedMetric] !== 0) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                if (getLethalityRate(county) !== 0) {
                    d3.select(d).style('fill', getColor(getLethalityRate(county)));
                } else {
                    d3.select(d).style('fill', 'white');
                }
            } else {
                let val = data[selectedDate][county][selectedMetric];
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
    $('.popup').remove();

    let svg = d3.select('#map');
    let map = $('#map');
    let strokeColor

    let width = map.parent().width(),
        height = map.parent().height();

    // Map and projection
    let projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], geoData);

    //hover div
    let hoverPopup = d3.select('.map-container').append('div')
        .attr('class', 'popup');

    // click div
    let clickPopup = d3.select('.map-container').append('div')
        .attr('class', 'popup click-popup');

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
            if (Object.keys(data[selectedDate]).includes(d.properties.AGS)
                && data[selectedDate][d.properties.AGS][selectedMetric] !== 0) {
                if (selectedMetric === Metric.LETHALITY_RATE) {
                    if (getLethalityRate(d.properties.AGS) !== 0) {
                        return getColor(getLethalityRate(d.properties.AGS))
                    } else {
                        return 'white';
                    }
                } else {
                    // keep county selection while resizing
                    if (d.properties.AGS === selectedCountyId) {
                        this.classList.add('selected-county');
                    }
                    return getColor(data[selectedDate][d.properties.AGS][selectedMetric]);
                }
            } else {
                return 'white';
            }
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
            hoverPopup.style('display', 'inline');
        })
        .on('mouseover', function (d) {
            fillPopupWithContent(d, hoverPopup);
            strokeColor = getStrokeColor(d);
            d3.select(this).style('stroke', strokeColor);
            d3.select(this).style('stroke-width', 2);
        })
        .on('mouseout', function () {
            hoverPopup.style('display', 'none');
            if (!this.classList.contains('selected-county')) {
                d3.select(this).style('stroke', 'var(--background-dark-grey)');
                d3.select(this).style('stroke-width', 0.5);
            }
        })
        .on('click', function (d) {
                if (this.classList.contains('selected-county')) {
                    clickPopup.style('display', 'none');
                    removeCountySelectionOnMap();
                    updateMetricsForGermany();
                } else {
                    clickPopup.style('display', 'none');
                    removeCountySelectionOnMap();
                    updateMetricsForSelectedCounty(d.target.__data__.properties);
                    strokeColor = getStrokeColor(d);
                    d3.select(this).style('stroke', strokeColor);
                    this.classList.add('selected-county');
                    clickPopup.style('display', 'inline');
                    fillPopupWithContent(d, clickPopup);
                }
            }
        );

    function getStrokeColor(d) {
        let pathStyles = d.target.attributes['style'].value.split(';');
        let rgbInStyles = pathStyles.filter(s => s.includes('rgb'));
        if (rgbInStyles.length) {
            let rgbValue = rgbInStyles[0].substr(rgbInStyles[0].indexOf('rgb'));
            return strokeColor = getHighContrastColor(rgbValue);
        } else {
            return strokeColor = getHighContrastColor(d.target.attributes['fill'].value);
        }
    }

    function fillPopupWithContent(d, element) {
        let svgWidth = $('#map').width();
        let topOffset = 7.5 * (document.documentElement.clientHeight / 100);
        let x = d.target.getBoundingClientRect().right - svgWidth + (d.target.getBoundingClientRect().width / 2);
        let y = Math.round(d.target.getBoundingClientRect().top - topOffset)
        element.moveToFront();
        element.style('left', x + 'px')
            .style('top', y + 'px')
            .html(d.target.__data__.properties['GEN']);
    }
}
