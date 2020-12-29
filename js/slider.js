const rangeSlider = document.getElementById("slider");
const sliderWidth = rangeSlider.offsetWidth;
const rangeHandler = document.getElementById("slider-handler");

const sliderPlayingSpeed = 100;
let isPlaying = false;
let player;

function showSliderValue() {
    rangeHandler.innerHTML = Object.keys(data)[rangeSlider.value];
    let bulletPosition = (rangeSlider.value /rangeSlider.max);
    rangeHandler.style.left = (bulletPosition * sliderWidth -30) + "px";
}

function initSlider(){
    d3.select("#slider")
        .property("min", 0)
        .property("max", Object.keys(data).length-1)
        .property("value", Object.keys(data).length-1)
        .property("step", 1)
        .attr("width",sliderWidth)
        .on("input", function() {
                console.log("slider: "+this.value);
                setDate(Object.keys(data)[this.value]);
            });
    drawAxis();
    showSliderValue();
    rangeSlider.addEventListener("input", showSliderValue, false);
}

function drawAxis(id = "#axis-slider") {

    var margin = {top: 0, right: 6, bottom: 20, left: 10},  // 20 is the width of the slider-thumb
        width = sliderWidth - margin.right -margin.left,
        height = 30;
    const date = Object.keys(data);
    const parseTime = d3.timeParse("%Y/%m/%d");
    //const formatDateIntoMonth = d3.timeFormat("%B");
    let dates = [];
    for(let obj of date){
        dates.push(parseTime(obj));
    }
    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const domain = d3.extent(dates);

    // Add X axis
    var x = d3.scaleTime()
        .domain(domain)
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
}

