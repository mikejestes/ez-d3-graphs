
var days = 60,
    start = (new Date().getTime() / 1000) - days * 86400,
    data = [],
    i = 0.
    colors = ['blue', 'red'];

for (; i < days; i++) {
    open = Math.floor(Math.random()*3000)
    data.push({
        open: open,
        close: open + Math.floor(Math.random()*201),
        start: Math.round(start + Math.floor(Math.random() * days * 86400)),
        duration: Math.floor(Math.random()*200000),
        color: colors[Math.floor(Math.random()*2)]
    });
}

console.log(JSON.stringify(data));

