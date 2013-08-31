
    expose.ComboGraph = function (el, width, height, options) {

        var defaults = {
                topGutter: 10,
                leftGutter: 0,
                rightGutter: 0,
                bottomGutter: 5
            };

        this.el = el;
        this.options = extend(defaults, options);
        this.width = width;
        this.height = height;
        this.graphs = [];
        this.leftAxis = null;
        this.rightAxis = null;
        this.bottomAxis = null;

    };
    expose.ComboGraph.prototype = {
        render: function () {

            var i,
                svg = d3.select(this.el).append("svg")
                    .attr("width", this.width + 'px')
                    .attr("height", this.height + 'px');

            this.alter('svg', svg);

            svg.append('defs').append('style').text('.popup { font-family: sans-serif; font-size: 10px; }');

            if (this.leftAxis) {
                this.graphs.push(this.leftAxis);
                this.options.leftGutter += this.leftAxis.getWidth();
            }
            if (this.rightAxis) {
                this.graphs.push(this.rightAxis);
                this.options.rightGutter += this.rightAxis.getWidth();
            }
            if (this.bottomAxis) {
                this.graphs.push(this.bottomAxis);
                this.options.bottomGutter += this.bottomAxis.getHeight();
            }

            for (i = 0; i < this.graphs.length; i += 1) {
                if (this.graphs[i].before) {
                    this.graphs[i].before();
                }
                this.graphs[i].render(svg, {
                    width: this.width,
                    height: this.height,
                    topGutter: this.options.topGutter,
                    rightGutter: this.options.rightGutter,
                    bottomGutter: this.options.bottomGutter,
                    leftGutter: this.options.leftGutter
                });
                if (this.graphs[i].after) {
                    this.graphs[i].after();
                }
            }

            return svg;

        },
        add: function (graph) {
            var axisOptions = {
                    position: 'left',
                    ticks: this.height / globalTickRatio
                };

            this.graphs.push(graph);

            if (!this.leftAxis) {
                axisOptions.label = graph.options.label;
                this.leftAxis = new expose.GraphAxis(0, graph.maxYValue(graph.data), axisOptions);
            } else if (!this.rightAxis) {
                axisOptions.position = 'right';
                axisOptions.label = graph.options.label;
                this.rightAxis = new expose.GraphAxis(0, graph.maxYValue(graph.data), axisOptions);
            }
            if (!this.bottomAxis) {
                this.bottomAxis = new expose.LineAxis({position: 'bottom'});
            }

            return this;
        },
        setLeftAxis: function (axis) {
            this.leftAxis = axis;
            return this;
        },
        setRightAxis: function (axis) {
            this.rightAxis = axis;
            return this;
        },
        setBottomAxis: function (axis) {
            this.bottomAxis = axis;
            return this;
        },
        setOption: function (key, value) {
            this.options[key] = value;
            return this;
        },
        alter: function(option, object) {

        }
    };
