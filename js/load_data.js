var data;
var counties;

async function loadData() {
    const dataPromise = fetch('data/data.json').then(res => res.json());
    const countiesPromise = fetch('data/counties.json').then(res => res.json());

    const results = await Promise.all([dataPromise, countiesPromise]);
    data = results[0]
    counties = results[1]

    onDataLoaded();
}

loadData();
