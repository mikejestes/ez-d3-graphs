
var days = 60,
    data = [],
    i = 0;

for (; i < days; i++) {
    data.push({
        orders: Math.floor(Math.random()*101),
        sales: Math.floor(Math.random()*100001) / 100
    });
}

console.log(JSON.stringify(data));

