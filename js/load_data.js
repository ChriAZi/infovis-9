var data;
var counties;

async function loadData() {
    let response1 = await fetch('data/counties.json');
    counties = await response1.json();

    let response2 = await fetch('data/data.json');
    data = await response2.json();
    selectedDate = Object.keys(data)[Object.keys(data).length - 1];

    onDataLoaded();
}

loadData();
