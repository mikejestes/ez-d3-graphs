
var days = 30,
    data = [],
    i = 0;

for (; i < days; i++) {
    data.push(Math.floor(Math.random()*101));
}

console.log(JSON.stringify(data));

