
var days = 60,
    data = [],
    i = 0;

for (; i < days; i++) {
    data.push({
        opened: Math.floor(Math.random()*12),
        rejected: Math.floor(Math.random()*7),
        countered: Math.floor(Math.random()*11),
        completed: Math.floor(Math.random()*6)
    });
}

console.log(JSON.stringify(data));

