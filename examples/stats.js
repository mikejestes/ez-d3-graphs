

(function() {

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

    d3.json('../data/dots.json', function(data) {

        var lr = linearRegression(d3.keys(data), d3.values(data));

        var acceptanceGraph = new ezD3Graphs.ScatterPlot(data, {
                color: 'darkblue',
                element: 'circle',
                width: 3
            }),
            leftAxis = new ezD3Graphs.GraphAxis(0, 1, {
                position: 'left',
                label: 'Likelyhood',
                tickFormat: function(d) { return d * 100 + '%'; }
            }),
            bottomAxis = new ezD3Graphs.GraphAxis(0, acceptanceGraph.maxXValue(), {
                position: 'bottom',
                label: 'Discount',
                tickFormat: function(d) { return d + '%'; }
            }),
            line = new ezD3Graphs.Line({
                color: 'red',
                thickness: 7,
                opacity: 0.4
            }),
            graph = new ezD3Graphs.ComboGraph('#xy', 800, 300);

        // force the perspective of 100% x values
        acceptanceGraph.maxXValue = function() {
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

})();
