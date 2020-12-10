var data;
var counties;
var geoData;

async function loadData() {
    const dataPromise = fetch('data/data.json').then(res => res.json());
    const countiesPromise = fetch('data/counties.json').then(res => res.json());
    const landkreisePromise = fetch('data/landkreise.geojson').then(res => res.json());

    const results = await Promise.all([dataPromise, countiesPromise, landkreisePromise]);
    data = results[0]
    counties = results[1]
    geoData = results[2]
    
    onDataLoaded();
}

loadData();
