
(function() {

    var graphWidth = 450,
        graphHeight = 200,
        largeGraphHeight = 200,
        relativeTicks = graphHeight / 30,
        dateTicks = graphWidth / 100;

    d3.json('../data/basic.json', function(data) {

        // easy bar graph
        new ezD3Graphs.ResponsiveGraph('#bar', graphWidth, 100).add(new ezD3Graphs.BarGraph(data)).render();

        // line graph with label
        var graph = new ezD3Graphs.ResponsiveGraph('#line', graphWidth, 100),
            lineGraph = new ezD3Graphs.LineGraph(data, {label: 'Pickles Eaten'});

        graph.add(lineGraph).render();

    });

})();
