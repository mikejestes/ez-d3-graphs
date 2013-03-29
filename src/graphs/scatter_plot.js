
    expose.ScatterPlot = function (data, options) {
        var defaults = {
            color: '#000',
            element: 'rect',
            width: 10,
            height: 10,
            opacity: 1
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.ScatterPlot.prototype = extend(new BaseGraph(), {
        maxXValue: function (data) {
            return d3.max(d3.keys(data), function (i) {
                return parseFloat(i, 10);
            });
        },
        render: function (svg, props) {

            var self = this,
                dataEnter = svg.append('g').selectAll(self.element).data(this.data).enter(),
                x = 'x',
                y = 'y';

            self.xScale = d3.scale.linear().domain([0, this.maxXValue(this.data)]).range([props.leftGutter, props.width - props.rightGutter]);
            self.yScale = d3.scale.linear().domain([0, this.maxYValue(this.data)]).range([props.height - props.bottomGutter, props.topGutter]);

            if (this.options.element === 'circle') {
                x = 'cx';
                y = 'cy';
            }

            dataEnter.append(self.options.element)
                .attr(x, function (d, i) { return self.xScale(d3.keys(self.data)[i]); })
                .attr(y, this.applyYScale(self.yScale))
                .attr("width", self.options.width)
                .attr("height", self.options.height)
                .attr("r", self.options.width)
                .attr("opacity", self.options.opacity)
                .attr('fill', this.options.color);

        }
    });
