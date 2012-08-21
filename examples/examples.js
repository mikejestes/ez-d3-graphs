
(function() {

    var graphWidth = 800,
        graphHeight = 200,
        relativeTicks = graphHeight / 30,
        dateTicks = graphWidth / 120;

    d3.json('../data/orders.json', function(data) {

        var orders = ezD3Graphs.pluck(data, 'orders'),
            sales = ezD3Graphs.pluck(data, 'sales'),
            startDate = new Date(new Date().getTime() - orders.length * 86400 * 1000);

        var leftAxis = new ezD3Graphs.GraphAxis(0, d3.max(orders), {
            position: 'left',
            label: 'Daily orders',
            ticks: relativeTicks
        }), ordersGraph = new ezD3Graphs.BarGraph(orders, {
            color: 'lightblue'
        }), salesGraph = new ezD3Graphs.LineGraph(sales, {
            color: 'darkgreen'
        }), rightAxis = new ezD3Graphs.GraphAxis(0, d3.max(sales), {
            position: 'right',
            color: 'darkgreen',
            label: 'Daily PW Revenue',
            ticks: relativeTicks,
            tickFormat: function(d) { return '$' + d; }
        }), dateAxis = new ezD3Graphs.GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        ezD3Graphs.comboGraph('#orders', graphWidth, graphHeight, [ordersGraph, leftAxis, salesGraph, rightAxis, dateAxis]);
    });

    d3.json('../data/transactions.json', function(data) {

        var startDate = new Date(new Date().getTime() - data.length * 86400 * 1000),
            fields = {
                opened: 'blue',
                countered: 'orange',
                rejected: 'red',
                completed: 'green'
            };

        var leftAxis = new ezD3Graphs.GraphAxis(0, ezD3Graphs.crawlMax(data), {
            position: 'left',
            label: 'Offer Actions',
            ticks: relativeTicks
        }), graph = new ezD3Graphs.StackedBarGraph(data, {
            color: 'lightblue',
            fields: fields
        }), dateAxis = new ezD3Graphs.GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        var svg = ezD3Graphs.comboGraph('#transactions', graphWidth, graphHeight, [graph, leftAxis, dateAxis]);

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

    d3.json('../data/duration.json', function(data) {

        var startDate = new Date(new Date().getTime() - data.length * 86400 * 1000);

        var leftAxis = new ezD3Graphs.GraphAxis(0, d3.max(ezD3Graphs.pluck(data, 'close')), {
            position: 'left',
            label: 'Offer Amount',
            ticks: relativeTicks,
            tickFormat: function(d) { return '$' + d; }
        }), graph = new ezD3Graphs.TimeValueGraph(data, {
            color: 'blue',
            y: 'open',
            y2: 'close',
            x: 'start',
            width: 'duration',
            tickHeight: 6,
            opacity: 0.9,
        }), dateAxis = new ezD3Graphs.GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        var svg = ezD3Graphs.comboGraph('#duration', graphWidth, graphHeight, [graph, leftAxis, dateAxis], {
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
