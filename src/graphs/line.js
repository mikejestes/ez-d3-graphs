
    expose.Line = function (options) {
        var defaults = {
            color: '#0f0',
            thickness: 2,
            opacity: 1
        };

        this.options = extend(defaults, options);
    };
    expose.Line.prototype = extend(new BaseGraph(), {
        render: function (svg, props) {

            svg.append("line")
                .attr('x1', this.xScale(this.options.x1))
                .attr('y1', this.yScale(this.options.y1))
                .attr('x2', this.xScale(this.options.x2))
                .attr('y2', this.yScale(this.options.y2))
                .attr('stroke', this.options.color)
                .attr('stroke-width', this.options.thickness)
                .attr('opacity', this.options.opacity);

        }
    });
