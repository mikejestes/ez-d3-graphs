
(function() {

    var graphWidth = 450,
        graphHeight = 200,
        largeGraphHeight = 200,
        relativeTicks = graphHeight / 30,
        dateTicks = graphWidth / 100;

    d3.json('data/basic.json', function(data) {

        // easy bar graph
        new ezD3Graphs.ComboGraph('#bar', graphWidth, 100).add(new ezD3Graphs.BarGraph(data)).render();

        // line graph with label
        var graph = new ezD3Graphs.ComboGraph('#line', graphWidth, 100),
            lineGraph = new ezD3Graphs.LineGraph(data, {label: 'Pickles Eaten'});

        graph.add(lineGraph).render();

    });

    d3.json('data/basic.json', function (data) {
        var graph = new ezD3Graphs.ComboGraph('#axis', graphWidth, 100),
            noaxis = new ezD3Graphs.ComboGraph('#noaxis', graphWidth, 100),
            alt = [];

        for (i = 0; i < 60; i++) {
            alt[i] = Math.floor(Math.random()*1001);
        }

        graph.add(new ezD3Graphs.BarGraph(alt, {color: 'red'}));
        graph.add(new ezD3Graphs.LineGraph(data));

        graph.render();

        noaxis.add(new ezD3Graphs.BarGraph(alt, {color: 'red'}));
        noaxis.add(new ezD3Graphs.LineGraph(data));

        noaxis.setLeftAxis(null);
        noaxis.setRightAxis(null);

        noaxis.render();

    });

    function popupGraph() {

        var days = 10,
            data = [],
            i = 0,
            v,
            graph = new ezD3Graphs.ComboGraph('#popup', 300, 100),
            bar;

        for (; i < days; i++) {
            v = Math.floor(Math.random()*101);
            data.push({
                value: v,
                desc: v + ' things'
            });
        }

        bar = new ezD3Graphs.BarGraph(data, {
            yValue: 'value',
            onHover: function(item) {
                return item.value;
            }
        });
        graph.add(bar);

        graph.render();

    }

    popupGraph();

    function boxPlotGraph() {

        var days = 10,
            data = {
                'Type A': [],
                'Type B': []
            },
            i = 0,
            v,
            graph = new ezD3Graphs.ComboGraph('#boxplot', 200, 200),
            bar;

        for (; i < days; i++) {
            v = Math.floor(Math.random()*101);
            data['Type A'].push(v);
            v = Math.floor(Math.random()*101);
            data['Type B'].push(v);
        }

        bar = new ezD3Graphs.BoxPlot(data, {

        });
        graph.add(bar)
            .setLeftAxis(null)
            .setBottomAxis(null)
            .setOption('topGutter', 20)
            .setOption('bottomGutter', 20)

        graph.render();

    }

    boxPlotGraph();

    d3.json('data/transactions.json', function(data) {

        var graph = new ezD3Graphs.ComboGraph('#stacked-line', graphWidth, 100),
            stackedLineGraph = new ezD3Graphs.StackedLineGraph(data),
            leftAxis = new ezD3Graphs.GraphAxis(0, stackedLineGraph.maxYValue(data), {
                position: 'left',
                label: 'Daily Flushes',
                axisColor: 'darkblue',
                tickColor: 'lightblue',
                labelColor: 'lightblue',
            });

        graph.add(stackedLineGraph).render();

    });


    function linearRegression(xs, ys) {

        var xmean = d3.mean(xs),
            ymean = d3.mean(ys),
            xregression = [],
            yregression = [],
            xy = [],
            x2 = [],
            slope,
            intercept;

        d3.map(xs).forEach(function(key, value) {
            xregression.push(value - xmean);
        });
        d3.map(ys).forEach(function(key, value) {
            yregression.push(value - ymean);
        });
        d3.map(xregression).forEach(function(key, value) {
            x2.push(value * value);
        })
        d3.map(xregression).forEach(function(key, value) {
            xy.push(value * yregression[key]);
        })

        slope = d3.sum(xy) / d3.sum(x2);
        intercept = ymean - slope * xmean;

        return {slope: slope, intercept: intercept};

    }

    d3.json('data/dots.json', function(data) {

        var lr = linearRegression(d3.keys(data), d3.values(data));

        var acceptanceGraph = new ezD3Graphs.ScatterPlot(data, {
                color: 'darkblue',
                element: 'circle',
                width: 3
            }),
            leftAxis = new ezD3Graphs.GraphAxis(0, 1, {
                position: 'left',
                label: 'Likelyhood',
                ticks: 4,
                tickFormat: function(d) { return d * 100 + '%'; }
            }),
            bottomAxis = new ezD3Graphs.GraphAxis(0, 100, {
                position: 'bottom',
                label: 'Discount',
                tickFormat: function(d) { return d + '%'; }
            }),
            line = new ezD3Graphs.Line({
                color: 'red',
                thickness: 7,
                opacity: 0.4
            }),
            graph = new ezD3Graphs.ComboGraph('#xy', graphWidth, 100);

        // force the perspective of 100% x values
        acceptanceGraph.maxXValue = function(data) {
            return 100;
        }

        acceptanceGraph.after = function() {
            line.xScale = acceptanceGraph.xScale;
            line.yScale = acceptanceGraph.yScale;

            line.options.x1 = 0;
            line.options.y1 = lr.intercept;
            line.options.x2 = -lr.intercept / lr.slope;
            line.options.y2 = 0;
        };

        graph.add(acceptanceGraph)
            .setLeftAxis(leftAxis)
            .setBottomAxis(bottomAxis)
            .add(line)
            .setRightAxis()
            .setOption('leftGutter', 10);

        graph.render();

    });


    d3.json('data/orders.json', function(data) {

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

        graph = new ezD3Graphs.ComboGraph('#orders', graphWidth, largeGraphHeight);
        graph.add(ordersGraph)
            .add(salesGraph)
            .setLeftAxis(leftAxis)
            .setRightAxis(rightAxis)
            .setBottomAxis(dateAxis);

        graph.render();

    });

    d3.json('data/transactions.json', function(data) {

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

        graph = new ezD3Graphs.ComboGraph('#transactions', graphWidth, largeGraphHeight);

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

    d3.json('data/duration.json', function(data) {

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

        graph = new ezD3Graphs.ComboGraph('#duration', graphWidth, largeGraphHeight);

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
