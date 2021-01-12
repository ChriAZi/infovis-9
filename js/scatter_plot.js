const countyNames = [];
function updateScatterPlot(){    
    for (i in geoData.features){
        countyNames[geoData.features[i].properties.AGS] = geoData.features[i].properties.GEN;
    }
    initScatterPlot();
}

function initScatterPlot(){
    let parent = $('.scatter-container');
    let margin = {top: 50, right: 50, bottom: 50, left: 50};
    let width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom;
    
    d3.select("#scatter-plot").selectAll("*").remove();
    var filteredIds = Object.keys(counties).filter(item => item != 'all' && Object.keys(countyNames).includes(item));

    var svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (margin.left+14) + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(filteredIds, function(d){
            return counties[d].density!=null ? counties[d].density: 0
        })+1])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5, "f"))
        .append('style').text('text { font-family: var(--font-family)}')
        .append('style').text('text { font-size: var(--font-size-timeline)}')
        .append('style').text('text { color: var(--font-color)}');

    // text label for the x axis
    svg.append("text")
        .attr("transform","translate(" + (width / 2) + " ," +(height + margin.top - 10) + ")")
        .style("text-anchor", "middle")
        .text("Bevölkerungsdichte")
        .append('style').text('text { font-family: var(--font-family)}')
        .append('style').text('text { font-size: var(--font-size-timeline)}')
        .append('style').text('text { color: var(--font-color)}');

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(filteredIds, function(d){
            return data[selectedDate][d][selectedMetric]!=null ? data[selectedDate][d][selectedMetric] : 0;
        })+1])
        .range([height, 0]);

    svg.append("g")
        //.attr("transform", "translate(14," + 0 + ")")
        .call(d3.axisLeft(y).ticks(5, "f"))
        .append('style').text('text { font-family: var(--font-family)}')
        .append('style').text('text { font-size: var(--font-size-timeline)}')
        .append('style').text('text { color: var(--font-color)}');

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 14)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(getMetricsText())            
        .append('style').text('text { font-family: var(--font-family)}')
        .append('style').text('text { font-size: var(--font-size-timeline)}')
        .append('style').text('text { color: var(--font-color)}');


    //hover div
    var div = d3.select("#scatter-plot").append("div")	
        .attr('id', 'plot-hover')
        .style("position", "absolute")
        .style("opacity", .9)
        .style("border-radius", "15px")
        .style("text-align", "center")
        .style("background-color", "gray")
        .style("color", "white")
        .style("font-size", "14px")
        .style("padding", "5px")
        .style("display", "none");
    

    d3.selection.prototype.moveToFront = function(){
        return this.each(function(){
            this.parentNode.appendChild(this);
        })
    }
    svg.append('g')
        .selectAll("dot")
        .data(filteredIds)
        .enter()
        .append("circle")
        .attr("id", function(d){
            return ""+d;
        }) 
        .attr("name", function(d){
            return counties[d].name;
        }) 
        .attr("cy", function (d) {
            return y(data[selectedDate][d][selectedMetric]);
        })
        .attr("cx", function (d) {
            return x(counties[d].density);
        })
        .attr("r", function(d){
            
            //Circle size is population based
            /*
            var max = d3.max(filteredIds, function(d){
                return counties[d].population!=null ? counties[d].population : 0;
            });
            if(data[selectedDate][d][selectedMetric] == null){
                return 0;
            }
            return counties[d].population/max*20;
            */
            return data[selectedDate][d][selectedMetric] == null ? 0 : 3; 
        })
        .style("fill", function(d){
            if(data[selectedDate][d][selectedMetric]!=0){
                return getColor(data[selectedDate][d][selectedMetric])
            }
            return "white";
        })
        .style("stroke", "black")
        .on("mousemove", function(d){
            div.style("display", "inline");
        })
        .on("mouseover", function(d){
            //d3.select(this).moveToFront();

            div.style("padding-top", 6+"px")
                .style("height", 35+"px")
                .style("left", (d.layerX) + "px")
                .style("top", (d.layerY-40) + "px")
                .html(countyNames[this.id]);
            
            d3.select(this).style("stroke-width", 3);
        })                
        .on("mouseout", function(){
            div.style("display", "none");
            d3.select(this).style("stroke-width", 1);
        })
        .on("click", function(d){ 
            console.log(d);
        });
}
 
function getMetricsText(){
    var text = '';
    switch (selectedMetric) {
        case Metric.NEW_CASES:
            text = 'Neuinfektionen';
            break;
        case Metric.NEW_DEATHS:
            text = 'neue Todesfälle';
            break;
        case Metric.TOTAL_CASES:
            text = 'Infektionen';
            break;
        case Metric.TOTAL_DEATHS:
            text = 'Gesamtzahl Todesfälle';
            break;
        case Metric.CASE_INCIDENCE:
            text = '7-Tage-Inzidenz Neuinfektionen';
            break;
        case Metric.DEATH_INCIDENCE:
            text = '7-Tage-Inzidenz Todesfälle';
            break;
    }
    return text;
}
