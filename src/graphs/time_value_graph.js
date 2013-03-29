
    expose.TimeValueGraph = function (data, options) {
        var defaults = {
            color: '#000',
            'stroke-width': 2,
            tickHeight: 10,
            opacity: 1.0
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.TimeValueGraph.prototype = extend(new BaseGraph(), {
        render: function (svg, props) {

            var options = this.options,
                yMax = d3.max(expose.pluck(this.data, this.options.y)),
                y2Max = d3.max(expose.pluck(this.data, this.options.y2)),
                yScale = d3.scale.linear().domain([0, yMax]).range([props.height - props.bottomGutter, props.topGutter]),
                y2Scale = d3.scale.linear().domain([0, y2Max]).range([props.height - props.bottomGutter, props.topGutter]),
                xScale = d3.time.scale().domain([
                    d3.min(expose.pluck(this.data, this.options.x)),
                    d3.max(expose.pluck(this.data, this.options.x))
                ]).range([props.leftGutter, props.width - props.rightGutter]),
                dataEnter = svg.append('g').selectAll("line").data(this.data).enter(),
                color = function (data) {
                    if (data.color) {
                        return data.color;
                    }

                    return options.color;
                };

            dataEnter.append("line")
                .attr("x1", function (data, b) {
                    return xScale(data[options.x]);
                })
                .attr('x2', function (data) {
                    return xScale(data[options.x] + data[options.width]);
                })
                .attr("y1", function (data) {
                    return yScale(data[options.y]);
                })
                .attr('y2', function (data) {
                    return y2Scale(data[options.y2]);
                })
                .attr('stroke', color)
                .attr('stroke-width', options['stroke-width'])
                .attr('opacity', options.opacity);

            dataEnter.append("line")
                .attr("x1", 0)
                .attr('x2', 0)
                .attr("y1", options.tickHeight / -2)
                .attr('y2', options.tickHeight / 2)
                .attr('stroke', color)
                .attr('stroke-width', options['stroke-width'])
                .attr('opacity', options.opacity)
                .attr('transform', function (data) {
                    var o = yScale(data[options.y]) - y2Scale(data[options.y2]),
                        a = xScale(data[options.x] + data[options.width]) - xScale(data[options.x]),
                        rotate = Math.atan(o / a) * rad2deg * -1;

                    return 'translate(' + d3.round(xScale(data[options.x])) + ', ' + d3.round(yScale(data[options.y])) + ')rotate(' + rotate + ')';
                });

            dataEnter.append("line")
                .attr("x1", 0)
                .attr('x2', 0)
                .attr("y1", options.tickHeight / -2)
                .attr('y2', options.tickHeight / 2)
                .attr('stroke', color)
                .attr('stroke-width', options['stroke-width'])
                .attr('opacity', options.opacity)
                .attr('transform', function (data) {
                    var o = yScale(data[options.y]) - y2Scale(data[options.y2]),
                        a = xScale(data[options.x] + data[options.width]) - xScale(data[options.x]),
                        rotate = Math.atan(o / a) * rad2deg * -1;

                    return 'translate(' + d3.round(xScale(data[options.x] + data[options.width])) + ', ' + d3.round(y2Scale(data[options.y2])) + ')rotate(' + rotate + ')';
                });

        }
    });
