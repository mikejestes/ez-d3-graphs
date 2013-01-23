
(function() {

    d3.json('../data/transactions.json', function(data) {

        var graph = new ezD3Graphs.ComboGraph('#one', 400, 100),
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

})();
