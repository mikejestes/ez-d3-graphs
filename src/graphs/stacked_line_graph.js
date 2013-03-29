
    expose.StackedLineGraph = function (data, options) {
        var defaults = {
            color: '#000'
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.StackedLineGraph.prototype = extend(new BaseGraph(), {
        maxYValue: function (data) {

            var max = 0;
            data.map(function (d) {
                max = d3.max([d3.sum(d3.map(d).values()), max]);
            });

            return max;
        },
        render: function (svg, props) {

            var self = this,
                max = 0,
                values,
                value,
                x = d3.time.scale().range([props.leftGutter, props.width - props.rightGutter]),
                y = d3.scale.linear().range([props.height - props.bottomGutter, props.topGutter]),
                color = d3.scale.category20(),
                area = d3.svg.area()
                    .x(function (d, i) { return x(i); })
                    .y0(function (d) { return y(d.y0); })
                    .y1(function (d) { return y(d.y0 + d.y); }),
                stack = d3.layout.stack()
                    .values(function (d) { return d.values; });

            color.domain(d3.keys(this.data[0]));

            values = stack(color.domain().map(function (name) {
                return {
                    name: name,
                    values: self.data.map(function (d) {
                        max = d3.max([d3.sum(d3.map(d).values()), max]);
                        return {y: d[name]};
                    })
                };
            }));

            x.domain([0, this.data.length]);
            y.domain([0, max]);

            value = svg.selectAll(".browser")
                .data(values)
                .enter().append("g")
                .attr("class", "browser");

            value.append("path")
                .attr("class", "area")
                .attr("d", function (d) { return area(d.values); })
                .style("fill", function (d) { return color(d.name); })
                .append('svg:title')
                    .text(function (d) { return d.name; });

        }
    });
