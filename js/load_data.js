var data;
var counties;

fetch('data/data.json')
    .then(res => res.json())
    .then(res => data = res)
    .then(res => selectedDate = Object.keys(data)[Object.keys(data).length - 1]);   // selected latest date (last element in sorted data)

fetch('data/counties.json')
    .then(res => res.json())
    .then(res => counties = res);
