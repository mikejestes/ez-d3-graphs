
    function extend(a, b) {
        d3.keys(b).forEach(function (key) {
            a[key] = b[key];
        });
        return a;
    }

    expose.oppositeColor = function (color) {
        var c = d3.hsl(color),
            opposite;

        if (c.l === 0) {
            c.l = 1;
        } else {
            c.l += 0.5;
            c.l = c.l % 1;
        }

        return c.toString();
    };

    expose.crawlMax = function (data) {
        var max = 0,
            i,
            j,
            itemSum,
            key;

        for (i = 0; i < data.length; i += 1) {
            itemSum = d3.sum(d3.values(data[i]));
            max = Math.max(itemSum, max);
        }

        return max;
    };

    expose.pluck = function (data, field) {
        var result = [];
        d3.map(data).forEach(function (key, value) {
            result.push(value[field]);
        });
        return result;
    };
