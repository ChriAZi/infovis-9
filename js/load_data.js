var data;
var counties;

fetch('data/data.json')
    .then(res => res.json())
    .then(res => data = res);

fetch('data/counties.json')
    .then(res => res.json())
    .then(res => counties = res);
