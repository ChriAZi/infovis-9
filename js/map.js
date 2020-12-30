var min = 0;
var max = 0;

//TODO may be moved to control.js? for finding date based min max values of selected metrics
function findMinMax(){
    var keys = Object.keys(data[selectedDate]);
    keys.forEach(obj=>{
        var val = data[selectedDate][obj][selectedMetric];
        if(val<min){
            min = val;
        }
        if(val>max){
            max = val;
        }
    })
}

function updateMap(){
    findMinMax();
    //console.log(selectedDate);
    //color path fill based on data
    d3.select("#map").selectAll("path").nodes().forEach(function(d){
        var str = (d.id).substring(1);
        if(Object.keys(data[selectedDate]).includes(str) && data[selectedDate][str][selectedMetric]!=0){
            var val = data[selectedDate][str][selectedMetric];
            d3.select(d).style("fill", getColor(min, max, val));
        }else{
            d3.select(d).style("fill", "white")
        }
    })
}

function initMap(){
    findMinMax();

    var svg = d3.select("#map");

    var width = +svg.attr("width"),
    height = +svg.attr("height");
    
    // Map and projection
    var projection = d3.geoMercator()
        // GPS of location to zoom on
        .center([12, 50])
        // This is like the zoom
        .scale(3000)
        // +40 needed for layout fit
        .translate([ (width/2 + 40), height/2])
    
    svg.append("g")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("fill", function(d){
            if(Object.keys(data[selectedDate]).includes(d.properties.AGS) && data[selectedDate][d.properties.AGS][selectedMetric]!=0){
                return getColor(min, max, data[selectedDate][d.properties.AGS][selectedMetric])
            }
            return "white"
        })
        .attr("id", function(d){
            return "i"+d.properties.AGS;
        })            
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "black")
        .on("mouseover", function(){
            var col = d3.select(this).style('fill')
            d3.select(this).style("stroke", col)
            d3.select(this).style("fill", "white")
        })                
        .on("mouseout", function(){
            var col = d3.select(this).style('stroke')
            d3.select(this).style("stroke", "black")
            d3.select(this).style("fill", col)
        })
        .on("click", function(d){
            d3.select("#infoText").text(this.id); 
            console.log(d);
        }
    );
}

function getColor(min, max, val){
    var v = 255/(min-max);
    return 'rgb(255,'+Math.round(v*(val-max))+',0)';
}
