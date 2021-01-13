const sliderPlayingSpeeds = [500, 300, 100, 80, 50, 30, 10];
let normalSpeed = 3;
let sliderSpeed = normalSpeed;
let isPlaying = false;
let player = null;

const longpress = 1000;

const dateSlider = document.getElementById('slider');
let sliderWidth;
const rangeHandler = document.getElementById('slider-handler');

const parseDateFromData = d3.timeParse('%Y/%m/%d');

function showSliderValue() {
    rangeHandler.innerHTML = getDateInFormat(Object.keys(data)[dateSlider.value]);
    let bulletPosition = (dateSlider.value / dateSlider.max);
    let handleWidth = $('#slider-handler').width();
    rangeHandler.style.left = (bulletPosition * sliderWidth - (handleWidth / 2) - 10) + 'px';
}

function initSlider() {
    d3.select('#slider')
        .property('min', 0)
        .property('max', Object.keys(data).length - 1)
        .property('value', Object.keys(data).length - 1)
        .property('step', 1)
        .attr('width', sliderWidth)
        .on('input', function () {
            setDate(Object.keys(data)[this.value]);
        });
    sliderWidth = $('#slider').width();
    drawSliderAxis();
    initButtons();
    showSliderValue();
    dateSlider.addEventListener('input', showSliderValue, false);
}

function drawSliderAxis(id = '#axis-slider') {
    var margin = {top: 20, right: 2, bottom: 20, left: 2},
        width = sliderWidth - margin.right - margin.left,
        height = $('#slider').height();
    const date = Object.keys(data);

    let dates = [];
    for (let obj of date) {
        dates.push(parseDateFromData(obj));
    }
    d3.select('#axis-slider').selectAll('*').remove();
    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    const domain = d3.extent(dates);

    // Add X axis
    var x = d3.scaleTime()
        .domain(domain)
        .range([0, width]);
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .append('style').text('text { font-family: var(--font-family)}')
        .append('style').text('text { font-size: var(--font-size-timeline)}')
        .append('style').text('text { color: var(--font-color)}');
}

function initButtons() {
    //document.getElementById("fast-button").disabled = true;
    //document.getElementById("slow-button").disabled = true;
    let delay;
    let longClickableButtons = document.getElementsByClassName('longClickable');
    let longClickableButton;

    for (let i = 0, j = longClickableButtons.length; i < j; i++) {
        longClickableButton = longClickableButtons[i];
        longClickableButton.addEventListener('mousedown', function () {
            let _this = this;
            delay = setTimeout(check, longpress);

            function check() {
                longClickedButton(_this);
            }

        }, true);

        longClickableButton.addEventListener('mouseup', function () {
            clearTimeout(delay);
        });

        longClickableButton.addEventListener('mouseout', function () {
            clearTimeout(delay);
        });

    }
}

function playOrStopSlider() {
    if (!isPlaying) {
        startPlaying();
    } else {
        stopPlaying();
    }
    document.querySelector('#slider').addEventListener(('input'), function () {
        stopPlaying();
    })
}

function startPlaying() {
    player = setInterval(stepForwardSlider, sliderPlayingSpeeds[sliderSpeed]);
    $('#play-button').find('img').attr('src', 'assets/pause.svg')
    isPlaying = true;
}

function stopPlaying() {
    if (player != null && isPlaying) {
        clearInterval(player);
    }
    $('#play-button').find('img').attr('src', 'assets/play.svg')
    isPlaying = false;
}

function playFaster() {
    if (sliderSpeed < sliderPlayingSpeeds.length) {
        sliderSpeed++;
    }
    if (isPlaying) {
        stopPlaying();
        startPlaying();
    }
}

function playSlower() {
    if (sliderSpeed > 0) {
        sliderSpeed--;
    }
    if (isPlaying) {
        stopPlaying();
        startPlaying();
    }
}

function stepForwardSlider() {
    d3.select('#slider')
        .property('value', function () {
            let nextValue = Number(this.value) + 1;
            let date = Object.keys(data)[nextValue];
            if (this.value < Object.keys(data).length - 1) {
                if (date !== undefined) {
                    setDate(date);
                }
                return nextValue;
            } else {
                return 0;
            }
        });
    showSliderValue();
}

function stepBackwardSlider() {
    d3.select('#slider')
        .property('value', function () {
            let nextValue = Number(this.value) - 1;
            let date = Object.keys(data)[nextValue];
            if (this.value > 0) {
                if (date !== undefined) {
                    setDate(date)
                }
                return nextValue;
            } else {
                return Object.keys(data).length - 1;
            }
        });
    showSliderValue();
}

function longClickedButton(button) {
    if (isPlaying) {
        stopPlaying();
    }
    if (button.id === 'forward-button') {
        d3.select('#slider')
            .property('value', function () {
                let lastDate = Object.keys(data)[Object.keys(data).length - 1];
                setDate(lastDate);
                return Object.keys(data).length - 1;
            });
        showSliderValue();
    } else if (button.id === 'backward-button') {
        d3.select('#slider')
            .property('value', function () {
                let firstDate = Object.keys(data)[0];
                setDate(firstDate);
                return 0;
            });
        showSliderValue();
    } else {
        console.log('No function for longClick implemented');
    }
}