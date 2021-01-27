const countyNames = [];

var rect, scatter, xAxisS, yAxisS, lastMetric, tempTransform, zoom, x, y, divClick;

function initScatterPlot() {
    for (i in geoData.features) {
        countyNames[geoData.features[i].properties.AGS] = geoData.features[i].properties.GEN;
    }
    updateScatterplot();
}

function updateScatterplot() {
    let parent = $('.scatter-container');
    let margin = {top: 50, right: 50, bottom: 50, left: 50};
    let width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom;

    let formatPercent = d3.format('.0%');

    d3.select('#scatter-plot').selectAll('*').remove();
    var filteredIds = Object.keys(counties).filter(item => item !== 'all' && Object.keys(countyNames).includes(item));

    var svg = d3.select('#scatter-plot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('id', 'scatter-plot-svg')
        .append('g')
        .attr('transform', 'translate(' + (margin.left + 14) + ',' + margin.top + ')');

    // Add X axis
    x = d3.scaleLinear()
        .domain([0, d3.max(filteredIds, function (d) {
            return counties[d].density != null ? counties[d].density : 0
        }) * 1.1])
        .range([0, width]);

    xAxisS = svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).ticks(5, 'f'));

    // text label for the x axis
    svg.append('text')
        .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top - 10) + ')')
        .style('text-anchor', 'middle')
        .text('Bevölkerungsdichte (Einwohner pro km²)');

    // Add Y axis
    if (selectedMetric === Metric.LETHALITY_RATE) {
        y = d3.scaleLinear()
            .domain([0, d3.max(filteredIds, function (d) {
                return getLethalityRate(d);
            }) * 1.1])
            .range([height, 0]);
        yAxisS = svg.append('g')
            .call(d3.axisLeft(y).ticks(5, 'f').tickFormat(formatPercent))
    } else {
        y = d3.scaleLinear()
            // .domain([0, Metric.properties[selectedMetric].scaledMax + 1])
            .domain([0, d3.max(filteredIds, d => {
                return scaleByPopulation(data[selectedDate][d][selectedMetric], d);
            }) * 1.1])
            .range([height, 0]);
        yAxisS = svg.append('g')
            .call(d3.axisLeft(y).ticks(5, 'f'))
    }

    // text label for the y axis
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left - 14)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(getMetricsText());

    //hover div
    var hoverPopup = d3.select('#scatter-plot').append('div')
        .attr('id', 'plot-hover')
        .attr('class', 'popup');

    var clickPopup = d3.select('#scatter-plot').append('div')
        .attr('id', 'plot-click')
        .attr('class', 'popup');


    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        })
    }

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width+5)
        .attr("height", height+5)
        .attr("x", 0)
        .attr("y", 0);

    zoom = d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0,0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);

    rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(0,0)')
        .call(zoom);

    scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")
    
    scatter.append('g')
        .selectAll('dot')
        .data(filteredIds)
        .enter()
        .append('circle')
        .attr('id', function (d) {
            return '' + d;
        })
        .attr('name', function (d) {
            return counties[d].name;
        })
        .attr('cy', function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return y(getLethalityRate(d));
            } else {
                return y(scaleByPopulation(data[selectedDate][d][selectedMetric], d));
            }
        })
        .attr('cx', function (d) {
            return x(counties[d].density);
        })
        .attr('r', function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return 3;
            } else {
                return data[selectedDate][d][selectedMetric] == null ? 0 : 3;
            }
        })
        .style('fill', function (d) {
            if (selectedMetric === Metric.LETHALITY_RATE) {
                return getColor(getLethalityRate(d));
            } else {
                if (data[selectedDate][d][selectedMetric] !== 0) {
                    return getColor(data[selectedDate][d][selectedMetric])
                }
            }
            return 'white';
        })
        .style('stroke', 'black')
        .style('stroke-width', function (d) {
            if (selectedCountyId === d) {
                clickPopup.style('display', 'inline')
                    .style('left', (this.getBBox().x + margin.left) + 'px')
                    .style('top', (this.getBBox().y + margin.top - 25) + 'px')
                    .html(countyNames[this.id]);
                d3.select(this).moveToFront();
                return d3.select(this).style('stroke-width', 3);
            }
            return d3.select(this).style('stroke-width', 1);
        })
        .on('mousemove', function () {
            hoverPopup.style('display', 'inline');
        })
        .on('mouseover', function (d) {
            hoverPopup.moveToFront();
            hoverPopup.style('left', (d.layerX) + 'px')
                .style('top', (d.layerY - 40) + 'px')
                .html(countyNames[this.id]);

            d3.select(this).style('stroke-width', 3);
        })
        .on('mouseout', function () {
            hoverPopup.style('display', 'none');
            if (selectedCountyId !== this.id) {
                d3.select(this).style('stroke-width', 1);
            }
        })
        .on('click', function () {
            document.getElementById('i' + this.id).dispatchEvent(new Event('click', {bubbles: true}));
        });
        setLastZoom();
        lastMetric = selectedMetric;
}

function updateChart({transform}) {
        //divClick.style('display', 'none');

        // recover the new scale
        var newX = transform.rescaleX(x);
        var newY = transform.rescaleY(y);
    
        // update axes with these new boundaries
        xAxisS.call(d3.axisBottom(newX).ticks(5, 'f'))
        yAxisS.call(d3.axisLeft(newY).ticks(5, 'f'))
    
        // update circle position
        scatter
            .selectAll("circle")
            .attr('cx', function(d) {
                return newX(counties[d].density);
            })
            .attr('cy', function(d) {
                if (selectedMetric === Metric.LETHALITY_RATE) {
                    return newY(getLethalityRate(d));
                } else {
                    return newY(data[selectedDate][d][selectedMetric]);
                }
            });
        
    tempTransform = transform;
}

function setLastZoom(){
    if(typeof(tempTransform)!="undefined" && lastMetric == selectedMetric){
        var t = d3.zoomIdentity.translate(tempTransform.x, tempTransform.y).scale(tempTransform.k);
        rect.call(zoom.transform, t);
    }
}

function scaleByPopulation(value, county) {  
    switch (selectedMetric) {
        case Metric.NEW_CASES:
        case Metric.NEW_DEATHS:
        case Metric.TOTAL_CASES:
        case Metric.TOTAL_DEATHS:
            return value * 100000 / counties[county]['population'];
        default:
            return value;
    }
}
