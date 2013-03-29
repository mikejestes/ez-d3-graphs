
    expose.BoxPlot = function (data, options) {
        var defaults = {
                color: '#000',
                yValue: null,
                barSeparation: 1,
                formatNumber: function (n) { return n; }
            },
            eachValue,
            self = this;

        this.data = data;
        this.options = extend(defaults, options);
        this.min = d3.min(d3.merge(d3.values(self.data)));
        this.max = d3.max(d3.merge(d3.values(self.data)));
        this.items = d3.values(this.data).length;
    };
    expose.BoxPlot.prototype = extend(new BaseGraph(), {
        render: function (svg, props) {

            var self = this,
                barWidth = 40,
                yscale,
                xscale,
                i = 0,
                textWidth = 25,
                textHeight = 10;

            xscale = d3.scale.linear().domain([0, this.items]).range([props.leftGutter, props.width - props.rightGutter]);
            yscale = d3.scale.linear().domain([this.min, this.max]).range([props.height - props.bottomGutter, props.topGutter]);

            i = 0.5;
            d3.map(this.data).forEach(function (key, values) {

                values = values.sort(d3.ascending);

                var bottom = d3.min(values),
                    first = d3.quantile(values, 0.25),
                    median = d3.quantile(values, 0.5),
                    third = d3.quantile(values, 0.75),
                    top = d3.max(values),
                    label = svg.append('text')
                        .text(key)
                        .attr('x', xscale(i))
                        .attr('y', yscale(top) - textHeight);

                label = label[0][0];
                label.setAttribute('x', label.getAttribute('x') - label.getBBox().width / 2);

                // quarters box
                svg.append('rect')
                    .attr("x", xscale(i) - barWidth / 2)
                    .attr("y", yscale(third))
                    .attr("width", barWidth)
                    .attr("height", yscale(first) - yscale(third))
                    .attr('stroke', self.options.color)
                    .attr('fill', '#fff');

                // median
                svg.append('line')
                    .attr('x1', xscale(i) - barWidth / 2)
                    .attr('x2', xscale(i) + barWidth / 2)
                    .attr('y1', yscale(median))
                    .attr('y2', yscale(median))
                    .attr('stroke', self.options.color);

                // min line
                svg.append('line')
                    .attr('x1', xscale(i))
                    .attr('x2', xscale(i))
                    .attr('y1', yscale(first))
                    .attr('y2', yscale(bottom))
                    .attr('stroke', self.options.color)
                    .attr('stroke-dasharray', '4 2');

                svg.append('line')
                    .attr('x1', xscale(i) - barWidth / 4)
                    .attr('x2', xscale(i) + barWidth / 4)
                    .attr('y1', yscale(bottom))
                    .attr('y2', yscale(bottom))
                    .attr('stroke', self.options.color);

                // max line
                svg.append('line')
                    .attr('x1', xscale(i))
                    .attr('x2', xscale(i))
                    .attr('y1', yscale(top))
                    .attr('y2', yscale(third))
                    .attr('stroke', self.options.color)
                    .attr('stroke-dasharray', '4 2');

                svg.append('line')
                    .attr('x1', xscale(i) - barWidth / 4)
                    .attr('x2', xscale(i) + barWidth / 4)
                    .attr('y1', yscale(top))
                    .attr('y2', yscale(top))
                    .attr('stroke', self.options.color);

                // inline numbers
                svg.append('text')
                    .text(self.options.formatNumber(top))
                    .attr('x', xscale(i) + barWidth / 2 + 2)
                    .attr('y', yscale(top) + textHeight / 2);

                svg.append('text')
                    .text(self.options.formatNumber(third))
                    .attr('x', xscale(i) - barWidth / 2 - textWidth)
                    .attr('y', yscale(third) + textHeight / 2);

                if (yscale(median) - textHeight > yscale(top)) {
                    svg.append('text')
                        .text(self.options.formatNumber(median))
                        .attr('x', xscale(i) + barWidth / 2 + 2)
                        .attr('y', yscale(median) + textHeight / 2)
                        .attr('style', 'font-weight: bold');
                }

                svg.append('text')
                    .text(self.options.formatNumber(first))
                    .attr('x', xscale(i) - barWidth / 2 - textWidth)
                    .attr('y', yscale(first) + textHeight / 2);

                svg.append('text')
                    .text(self.options.formatNumber(bottom))
                    .attr('x', xscale(i) + barWidth / 2 + 2)
                    .attr('y', yscale(bottom) + textHeight / 2);

                i += 1;
            });

        }
    });
