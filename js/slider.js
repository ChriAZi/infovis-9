function initSlider(){
    d3.select("#slider")
        .property("min", 0)
        .property("max", Object.keys(data).length-1)
        .property("value", Object.keys(data).length-1)
        .property("step", 1)
        .on("input", function() {
            console.log("slider: "+this.value);
            setDate(Object.keys(data)[this.value]);
        });
}
