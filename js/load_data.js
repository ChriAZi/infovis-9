var data;

fetch('data/data.json')
    .then(res => res.json())
    .then(res => data = res);
