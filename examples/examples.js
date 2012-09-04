
(function() {

    var graphWidth = 800,
        graphHeight = 200,
        relativeTicks = graphHeight / 30,
        dateTicks = graphWidth / 120;

    d3.json('../data/orders.json', function(data) {

        var graph,
            startDate = new Date(new Date().getTime() - data.length * 86400 * 1000),
            ordersGraph = new ezD3Graphs.BarGraph(data, {
                color: 'lightblue',
                yValue: 'orders'
            }),
            salesGraph = new ezD3Graphs.LineGraph(data, {
                color: 'darkgreen',
                yValue: 'sales'
            }),
            leftAxis = new ezD3Graphs.GraphAxis(0, ordersGraph.maxYValue(data), {
                position: 'left',
                label: 'Daily Orders',
                axisColor: 'darkblue',
                tickColor: 'lightblue',
                labelColor: 'lightblue',
                ticks: relativeTicks
            }),
            rightAxis = new ezD3Graphs.GraphAxis(0, salesGraph.maxYValue(data), {
                position: 'right',
                axisColor: 'purple',
                tickColor: 'orange',
                labelColor: 'darkgreen',
                label: 'Daily Sales',
                ticks: relativeTicks,
                tickFormat: function(d) { return '$' + d; }
            }),
            dateAxis = new ezD3Graphs.GraphAxis(startDate, new Date(), {
                position: 'bottom',
                type: 'date',
                ticks: dateTicks
            });

        graph = new ezD3Graphs.ComboGraph('#orders', graphWidth, graphHeight);
        graph.add(ordersGraph)
            .add(salesGraph)
            .setLeftAxis(leftAxis)
            .setRightAxis(rightAxis)
            .setBottomAxis(dateAxis);

        graph.render();

    });

    d3.json('../data/transactions.json', function(data) {

        var graph,
            svg,
            startDate = new Date(new Date().getTime() - data.length * 86400 * 1000),
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
        }), barGraph = new ezD3Graphs.StackedBarGraph(data, {
            color: 'lightblue',
            fields: fields
        }), dateAxis = new ezD3Graphs.GraphAxis(startDate, new Date(), {
            position: 'bottom',
            type: 'date',
            ticks: dateTicks
        });

        graph = new ezD3Graphs.ComboGraph('#transactions', graphWidth, graphHeight);

        graph.add(barGraph)
            .setLeftAxis(leftAxis)
            .setBottomAxis(dateAxis)
            .setOption('rightGutter', 70)

        svg = graph.render();

        // should be a legend helper
        var y = 70;

        for (key in fields) {
            svg.append('text')
                .text(key)
                .attr('style', 'font-family: sans-serif; font-size: 11px')
                .attr('fill', fields[key])
                .attr('x', graphWidth - 60)
                .attr('y', y)

            y += 30;
        }

    });

    d3.json('../data/duration.json', function(data) {

        var startDate = new Date(new Date().getTime() - data.length * 86400 * 1000),
            graph,
            svg;

        var leftAxis = new ezD3Graphs.GraphAxis(0, d3.max(ezD3Graphs.pluck(data, 'close')), {
            position: 'left',
            label: 'Offer Amount',
            ticks: relativeTicks,
            tickFormat: function(d) { return '$' + d; }
        }), timeGraph = new ezD3Graphs.TimeValueGraph(data, {
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

        graph = new ezD3Graphs.ComboGraph('#duration', graphWidth, graphHeight);

        graph.add(timeGraph)
            .setLeftAxis(leftAxis)
            .setBottomAxis(dateAxis)
            .setOption('leftGutter', 40)
            .setOption('rightGutter', 70)

        svg = graph.render();

        // should be a legend helper
        var y = 100,
            fields = {
                completed: 'blue',
                rejected: 'red'
            };

        for (key in fields) {
            svg.append('text')
                .text(key)
                .attr('style', 'font-family: sans-serif; font-size: 11px')
                .attr('fill', fields[key])
                .attr('x', graphWidth - 60)
                .attr('y', y)

            y += 30;
        }

    });

})();
