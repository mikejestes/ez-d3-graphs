
(function() {

    var graphWidth = 800,
        graphHeight = 250,
        relativeTicks = graphHeight / 30,
        dateTicks = graphWidth / 120;

    $.getJSON('../data/orders.json', function(data) {

        var orders = pluck(data, 'orders'),
            sales = pluck(data, 'sales'),
            startDate = new Date(new Date().getTime() - orders.length * 86400 * 1000);

        var leftAxis = new GraphAxis(0, getMaxValue(orders), {
            position: 'left',
            label: 'Daily orders',
            ticks: relativeTicks
        }), ordersGraph = new BarGraph(orders, {
            color: 'lightblue'
        }), salesGraph = new LineGraph(sales, {
            color: 'darkgreen'
        }), rightAxis = new GraphAxis(0, getMaxValue(sales), {
            position: 'right',
            color: 'darkgreen',
            label: 'Daily PW Revenue',
            ticks: relativeTicks,
            tickFormat: function(d) { return '$' + d; }
        }), dateAxis = new GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        comboGraph('#orders', graphWidth, graphHeight, [ordersGraph, leftAxis, salesGraph, rightAxis, dateAxis]);
    });

    $.getJSON('../data/transactions.json', function(data) {

        var startDate = new Date(new Date().getTime() - data.length * 86400 * 1000),
            fields = {
                opened: 'blue',
                countered: 'orange',
                rejected: 'red',
                completed: 'green'
            };

        var leftAxis = new GraphAxis(0, crawlMax(data), {
            position: 'left',
            label: 'Offer Actions',
            ticks: relativeTicks
        }), graph = new StackedBarGraph(data, {
            color: 'lightblue',
            fields: fields
        }), dateAxis = new GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        var svg = comboGraph('#transactions', graphWidth, graphHeight, [graph, leftAxis, dateAxis]);

        // should be a legend helper
        var y = 70;

        for (key in fields) {
            svg.append('text')
                .text(key)
                .attr('class', 'legend')
                .attr('fill', fields[key])
                .attr('x', graphWidth - 60)
                .attr('y', y)

            y += 30;
        }

    });

    $.getJSON('../data/duration.json', function(data) {

        var startDate = new Date(new Date().getTime() - data.length * 86400 * 1000);

        var leftAxis = new GraphAxis(0, getMaxValue(pluck(data, 'close')), {
            position: 'left',
            label: 'Offer Amount',
            ticks: relativeTicks,
            tickFormat: function(d) { return '$' + d; }
        }), graph = new TimeValueGraph(data, {
            color: 'blue',
            y: 'open',
            y2: 'close',
            x: 'start',
            width: 'duration',
            tickHeight: 6,
            opacity: 0.9,
        }), dateAxis = new GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        var svg = comboGraph('#duration', graphWidth, graphHeight, [graph, leftAxis, dateAxis], {
            leftGutter: 70
        });

        // should be a legend helper
        var y = 100,
            fields = {
                completed: 'blue',
                rejected: 'red'
            };

        for (key in fields) {
            svg.append('text')
                .text(key)
                .attr('class', 'legend')
                .attr('fill', fields[key])
                .attr('x', graphWidth - 60)
                .attr('y', y)

            y += 30;
        }

    });


})();
