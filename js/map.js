function setGeoData(){
    var mapNames = [];

    // The svg
    var svg = d3.select("#map");

    var width = +svg.attr("width"),
    height = +svg.attr("height");
    
    // Map and projection
    var projection = d3.geoMercator()
        .center([12, 50])                // GPS of location to zoom on
        .scale(3000)                       // This is like the zoom
        .translate([ width/2, height/2 ])
    
          // Load external data and boot
    d3.json("data/landkreise.geojson", function(data){
        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", function(d){
                return getColor(d.properties.GEN);
            })
            .attr("id", function(d){
                mapNames.push(d.properties.GEN)
                return d.properties.GEN;
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
                console.log("Click")
                d3.select("#infoText").text(d.properties.GEN); 
            });

        console.log("ArrLength: "+mapNames.length)
    })

    function getColor(element){
        //TODO get data for this specific element
        //TODO replace, only for color visualisation
        var numb = getRandomInt(3)
        if(numb==0){
            return "red";
        }else if(numb==1){
            return "orange";
        }
        return "yellow"
    }

    //TODO remove, after color function is implemented
    function getRandomInt(max){
        return Math.floor(Math.random() *Math.floor(max));
    }
}
