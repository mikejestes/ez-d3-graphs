
    expose.LineGraph = function (data, options) {
        var defaults = {
            color: '#000',
            yValue: null,
            lineTension: 0.9,
            'stroke-width': 3
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.LineGraph.prototype = extend(new BaseGraph(), {
        render: function (svg, props) {

            var barSeparation = 1,
                barWidth = -barSeparation + (props.width - props.leftGutter - props.rightGutter) / this.data.length,
                dataMax = this.maxYValue(this.data),
                xScale = d3.scale.linear().domain([0, this.data.length]).range([props.leftGutter, props.width - props.rightGutter]),
                yScale = d3.scale.linear().domain([0, dataMax]).range([props.height - props.bottomGutter, props.topGutter]),
                line = d3.svg.line()
                    .x(function (d, i) {
                        return barWidth / 2 + xScale(i);
                    })
                    .y(this.applyYScale(yScale))
                    .interpolate('cardinal')
                    .tension(this.options.lineTension);

            // the line path
            svg.append("svg:path").attr("d", line(this.data))
                .attr('stroke', this.options.color)
                .attr('stroke-width', this.options['stroke-width'])
                .attr('fill', 'none');

        }
    });
