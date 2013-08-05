/*
 * ez-d3-graphs
 * https://github.com/mikejestes/ez-d3-graphs
 *
 * Copyright (c) 2012-2013 Mike Estes <mikejestes@gmail.com>
 * @license Licensed under the MIT license.
 *
 *
 */
(function (d3, window) {
    var expose = {},
        rad2deg = 180 / Math.PI,
        globalTickRatio = 25,
        defaultLeftGutterAxis = 45,
        defaultRightGutterAxis = 60,
        defaultBottomGutterAxis = 20,
        leftLabelOffset = 15,
        rightLabelOffset = 55,
        BaseGraph = function () {};


    function extend(a, b) {
        d3.keys(b).forEach(function (key) {
            a[key] = b[key];
        });
        return a;
    }

    expose.oppositeColor = function (color) {
        var c = d3.hsl(color),
            opposite;

        if (c.l === 0) {
            c.l = 1;
        } else {
            c.l += 0.5;
            c.l = c.l % 1;
        }

        return c.toString();
    };

    expose.crawlMax = function (data) {
        var max = 0,
            i,
            j,
            itemSum,
            key;

        for (i = 0; i < data.length; i += 1) {
            itemSum = d3.sum(d3.values(data[i]));
            max = Math.max(itemSum, max);
        }

        return max;
    };

    expose.pluck = function (data, field) {
        var result = [];
        d3.map(data).forEach(function (key, value) {
            result.push(value[field]);
        });
        return result;
    };


    BaseGraph.prototype = {
        maxYValue: function (data) {
            var max;
            if (!this.options.yValue) {
                max =  d3.max(d3.values(data), function (i) {
                    return parseFloat(i, 10);
                });
            } else {
                max = d3.max(expose.pluck(data, this.options.yValue));
            }

            return max;
        },
        applyYScale: function (scale) {
            var self = this;
            return function (item) {
                var generatedScale;
                if (self.options.yValue === null) {
                    generatedScale = scale(item);
                } else {
                    generatedScale = scale(item[self.options.yValue]);
                }

                return generatedScale;
            };
        },
        showPopup: function (eventFunc, item, el, svg) {
            if (this.options[eventFunc]) {
                var x = parseInt(el.getAttribute('x'), 10),
                    y = el.getAttribute('y') - 5,
                    color = el.getAttribute('fill');

                x = x + parseInt((el.getAttribute('width') / 2), 10);

                this.drawPopup(svg, x, y, this.options[eventFunc](item), color);
            }
        },
        hidePopup: function (eventFunc, item, el, svg) {
            if (this.popup) {
                this.popup.remove();
            }
        },
        drawPopup: function (svg, x, y, value, color) {
            if (y < 10) {
                y += 15;
                color = expose.oppositeColor(color);
            }

            this.popup = svg.append('text')
                .text(value)
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('class', 'popup')
                .attr('fill', color);
        }
    };

    expose.BarGraph = function (data, options) {
        var defaults = {
            color: '#000',
            yValue: null,
            barSeparation: 1
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.BarGraph.prototype = extend(new BaseGraph(), {
        render: function (svg, props) {

            var self = this,
                barWidth = -this.options.barSeparation + (props.width - props.leftGutter - props.rightGutter) / this.data.length,
                dataMax = this.maxYValue(this.data),
                offerXScale = d3.scale.linear().domain([0, this.data.length]).range([props.leftGutter, props.width - props.rightGutter]),
                offerYTopScale = d3.scale.linear().domain([0, dataMax]).range([props.height - props.bottomGutter, props.topGutter]),
                offerYHeightScale = d3.scale.linear().domain([0, dataMax]).range([0, props.height - props.topGutter - props.bottomGutter]),
                dataEnter = svg.append('g').selectAll("rect").data(this.data).enter();

            //Draw the bars.
            dataEnter.append("rect")
                .attr("x", function (d, i) { return offerXScale(i); })
                .attr("y", this.applyYScale(offerYTopScale))
                .attr("width", barWidth)
                .attr("height", this.applyYScale(offerYHeightScale))
                .attr('fill', this.options.color)
                .attr('class', 'graph-value')
                .on('mouseenter', function (item) {
                    self.showPopup('onHover', item, this, svg);
                })
                .on('mouseleave', function (item) {
                    self.hidePopup('onHover', item, this, svg);
                })
                .append('svn:title')
                    .text(function (i) { return self.options.yValue ? i[self.options.yValue] : i; });

        }
    });

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
        }
    };

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

    expose.StackedBarGraph = function (data, options) {
        var defaults = {
            color: '#000',
            barSeparation: 1
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.StackedBarGraph.prototype = extend(new BaseGraph(), {
        maxYValue: function (data) {

            var max = 0;
            data.map(function (d) {
                max = d3.max([d3.sum(d3.map(d).values()), max]);
            });

            return max;
        },
        render: function (svg, props) {

            var self = this,
                barWidth = -this.options.barSeparation + (props.width - props.leftGutter - props.rightGutter) / this.data.length,
                dataMax = expose.crawlMax(this.data),
                offerXScale = d3.scale.linear().domain([0, this.data.length]).range([props.leftGutter, props.width - props.rightGutter]),
                offerYTopScale = d3.scale.linear().domain([0, dataMax]).range([props.height - props.bottomGutter, props.topGutter]),
                offerYHeightScale = d3.scale.linear().domain([0, dataMax]).range([0, props.height - props.topGutter - props.bottomGutter]),
                heightHistory = [],
                heightFunc = function (key) {
                    return function (d, i) {
                        var h = offerYHeightScale(d[key]);
                        if (!heightHistory[i]) {
                            heightHistory[i] = 0;
                        }
                        heightHistory[i] += h;
                        return h;
                    };
                },
                y = function (d, i) {
                    var h = heightHistory[i] || 0;
                    return props.height - props.bottomGutter - h;
                },
                x = function (d, i) {
                    return offerXScale(i);
                },
                titleText = function (key) {
                    return function (d, i) { return i + ' ' + key; };
                };

            d3.map(this.options.fields).forEach(function (field, color) {

                svg.append('g').selectAll("rect").data(self.data).enter()
                    .append("rect")
                    .attr("x", x)
                    .attr("width", barWidth)
                    .attr("height", heightFunc(field))
                    .attr("y", y)
                    .attr('fill', color)
                    .append('svg:title').text(titleText(field));

            });

        }
    });

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

    expose.GraphAxis = function (min, max, options) {
        var defaults = {
            position: 'left',
            axisColor: '#000',
            labelColor: '#000',
            tickColor: '#000',
            label: null,
            ticks: null,
            scale: 'linear',
            style: 'fill: none; shape-rendering: crispEdges',
            labelStyle: 'font-family: sans-serif; font-size: 12px'
        };

        this.min = min;
        this.max = max;
        this.options = extend(defaults, options);
    };
    expose.GraphAxis.prototype = extend(new BaseGraph(), {
        getWidth: function () {
            var width = 0;
            if (this.options.position === 'left') {
                width = defaultLeftGutterAxis;
            } else if (this.options.position === 'right') {
                width = defaultRightGutterAxis;
            }

            return width;
        },
        getHeight: function () {
            return defaultBottomGutterAxis;
        },
        render: function (svg, props) {

            var axisScale = d3.scale[this.options.scale]().domain([this.min, this.max]).range([props.height - props.bottomGutter, props.topGutter]),
                axis = d3.svg.axis().scale(axisScale).orient(this.options.position),
                labelWidth = this.options.label ? this.options.label.length * 3.5 : 0,
                translateX = 0,
                translateY = 0,
                translateLabelX = 0,
                translateLabelY = (props.height - props.bottomGutter) / 2 + labelWidth,
                rotateTextDeg = 270,
                axisSvg,
                unique = 'a' + d3.random.normal()().toString().substr(3);


            if (this.options.type === 'date') {
                axisScale = d3.time.scale().domain([this.min, this.max]).range([props.leftGutter, props.width - props.rightGutter]);
                axis = d3.svg.axis().scale(axisScale).orient('bottom');
            }

            if (this.options.position === 'left') {
                translateX = props.leftGutter;
                translateLabelX = leftLabelOffset - props.leftGutter;
            } else if (this.options.position === 'right') {
                translateX = props.width - props.rightGutter;
                translateLabelX = rightLabelOffset;
            } else if (this.options.position === 'bottom') {
                translateX = 0;
                translateY = props.height - props.bottomGutter;
                rotateTextDeg = 0;
                translateLabelX = props.width / 2 - labelWidth;
                translateLabelY = props.bottomGutter;
            }

            if (this.options.position === 'bottom' && this.options.type !== 'date') {
                axisScale = d3.scale.linear().domain([this.min, this.max]).range([props.leftGutter, props.width - props.rightGutter]);
                axis = d3.svg.axis().scale(axisScale).orient('bottom');
            }

            if (this.options.tickFormat) {
                axis.tickFormat(this.options.tickFormat);
            }
            if (this.options.ticks) {
                axis.ticks(this.options.ticks);
            }
            if (this.options.tickValues) {
                axis.tickValues(this.options.tickValues);
            }

            svg.append('defs')
                .append('style')
                .attr('transform', 'translate(' + translateX + ', ' + translateY + ')')
                .text('.' + unique + ' path, .' + unique + ' line {' + this.options.style + '; stroke: ' + this.options.axisColor + '} .' + unique + ' text {' + this.options.labelStyle + '; fill: ' + this.options.tickColor + '}');

            axisSvg = svg.append('g')
                .attr('class', unique)
                .attr('transform', 'translate(' + translateX + ', ' + translateY + ')')
                .call(axis);

            if (this.options.label) {
                axisSvg.append('text')
                    .text(this.options.label)
                    .attr('style', 'fill:' + this.options.labelColor)
                    .attr('transform', 'translate(' + translateLabelX + ',' + translateLabelY + ')rotate(' + rotateTextDeg + ')');
            }

        }
    });

    expose.LineAxis = function (options) {
        var defaults = {
            position: 'left',
            axisColor: '#000'
        };

        this.options = extend(defaults, options);
    };
    expose.LineAxis.prototype = extend(new BaseGraph(), {
        getHeight: function () {
            return defaultBottomGutterAxis;
        },
        render: function (svg, props) {

            var x1 = props.leftGutter,
                y1 = props.topGutter,
                x2 = props.width - props.rightGutter,
                y2 = props.height - props.bottomGutter,
                axisSvg,
                unique = 'a' + d3.random.normal()().toString().substr(3);

            if (this.options.position === 'left') {
                x2 = x1;
            } else if (this.options.position === 'right') {
                x1 = x2;
            } else if (this.options.position === 'bottom') {
                y1 = y2 = props.height - props.bottomGutter;
            }

            svg.append('defs').append('style').text('.' + unique + ' path, .' + unique + ' line {' + this.options.style + '; stroke: ' + this.options.axisColor + '}');

            axisSvg = svg.append('g')
                .attr('class', unique);

            axisSvg.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2);

        }
    });

    window.ezD3Graphs = expose;

}(d3, window));
