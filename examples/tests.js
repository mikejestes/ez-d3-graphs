
(function() {

    d3.json('../data/basic.json', function (data) {
        var graph = new ezD3Graphs.ComboGraph('#axis', 300, 100),
            noaxis = new ezD3Graphs.ComboGraph('#noaxis', 300, 100),
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

})();
