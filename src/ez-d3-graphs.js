/*
* ez-d3-graphs
* https://github.com/mikejestes/ez-d3-graphs
*
* Copyright (c) 2012 Mike Estes <mikejestes@gmail.com>
* Licensed under the MIT license.
*/

(function (d3, window) {
    var expose = {},
        rad2deg = 180 / Math.PI;

    function extend(a, b) {
        var i;
        for (i in b) {
            a[i] = b[i];
        }
        return a;
    }

    expose.crawlMax = function (data) {
        var max = 0,
            i,
            itemSum,
            key;

        for (i = 0; i < data.length; i++) {
            itemSum = 0;
            for (key in data[i]) {
                itemSum += data[i][key];
            }
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

    expose.comboGraph = function (el, width, height, graphs, options) {

        var defaults = {
                topGutter: 10,
                leftGutter: 45,
                rightGutter: 60,
                bottomGutter: 20
            },
            i,
            svg = d3.select(el).append("svg")
                .attr("width", width + 'px')
                .attr("height", height + 'px');

        options = extend(defaults, options);

        for (i = 0; i < graphs.length; i++) {
            graphs[i].render(svg, {
                width: width,
                height: height,
                topGutter: options.topGutter,
                rightGutter: options.rightGutter,
                bottomGutter: options.bottomGutter,
                leftGutter: options.leftGutter
            });
        }

        return svg;
    };

    expose.BarGraph = function (data, options) {
        var defaults = {
            color: '#000'
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.BarGraph.prototype = {
        render: function (svg, props) {

            var barSeparation = 1,
                barWidth = -barSeparation + (props.width - props.leftGutter - props.rightGutter) / this.data.length,
                dataMax = d3.max(this.data),
                offerXScale = d3.scale.linear().domain([0, this.data.length]).range([props.leftGutter, props.width - props.rightGutter]),
                offerYTopScale = d3.scale.linear().domain([0, dataMax]).range([props.height - props.bottomGutter, props.topGutter]),
                offerYHeightScale = d3.scale.linear().domain([0, dataMax]).range([0, props.height - props.topGutter - props.bottomGutter]),
                dataEnter = svg.append('g').selectAll("rect").data(this.data).enter();

            //Draw the bars.
            dataEnter.append("rect")
                .attr("x", function (d, i) { return offerXScale(i); })
                .attr("y", offerYTopScale)
                .attr("width", barWidth)
                .attr("height", offerYHeightScale)
                .attr('fill', this.options.color);

        }
    };

    expose.StackedBarGraph = function (data, options) {
        var defaults = {
            color: '#000'
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.StackedBarGraph.prototype = {
        render: function (svg, props) {

            var key,
                barSeparation = 1,
                barWidth = -barSeparation + (props.width - props.leftGutter - props.rightGutter) / this.data.length,
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
                };

            for (key in this.options.fields) {

                svg.append('g').selectAll("rect").data(this.data).enter()
                    .append("rect")
                    .attr("x", x)
                    .attr("width", barWidth)
                    .attr("height", heightFunc(key))
                    .attr("y", y)
                    .attr('fill', this.options.fields[key]);

            }


        }
    };

    expose.LineGraph = function (data, options) {
        var defaults = {
            color: '#000'
        };

        this.data = data;
        this.options = extend(defaults, options);
    };
    expose.LineGraph.prototype = {
        render: function (svg, props) {

            var barSeparation = 1,
                barWidth = -barSeparation + (props.width - props.leftGutter - props.rightGutter) / this.data.length,
                dataMax = d3.max(this.data),
                salesXScale = d3.scale.linear().domain([0, this.data.length]).range([props.leftGutter, props.width - props.rightGutter]),
                salesYScale = d3.scale.linear().domain([0, dataMax]).range([props.height - props.bottomGutter, props.topGutter]),
                line = d3.svg.line()
                    .x(function (d, i) {
                        return barWidth / 2 + salesXScale(i);
                    })
                    .y(function (d) {
                        return salesYScale(d);
                    })
                    .interpolate('cardinal')
                    .tension(0.9);

            // the line path
            svg.append("svg:path").attr("d", line(this.data))
                .attr('stroke', this.options.color)
                .attr('stroke-width', '3')
                .attr('fill', 'none');

        }
    };

    expose.GraphAxis = function (min, max, options) {
        var defaults = {
            position: 'left',
            label: null,
            labelColor: '#000',
            ticks: null,
            scale: 'linear'
        };

        this.min = min;
        this.max = max;
        this.options = extend(defaults, options);
    };
    expose.GraphAxis.prototype = {
        render: function (svg, props) {

            var axisScale = d3.scale[this.options.scale]().domain([this.min, this.max]).range([props.height - props.bottomGutter, props.topGutter]),
                axis = d3.svg.axis().scale(axisScale).orient(this.options.position),
                translateX = 0,
                translateY = 0,
                translateLabelX = 0,
                fontSizeDivisor = 10;

            if (this.options.type === 'date') {
                axisScale = d3.time.scale().domain([this.min, this.max]).range([props.leftGutter, props.width - props.rightGutter]);
                axis = d3.svg.axis().scale(axisScale).orient('bottom');
            }

            if (this.options.tickFormat) {
                axis.tickFormat(this.options.tickFormat);
            }
            if (this.options.ticks) {
                axis.ticks(this.options.ticks);
            }

            if (this.options.position === 'left') {
                translateX = props.leftGutter;
                translateLabelX = 15 + props.height / 60;
            } else if (this.options.position === 'right') {
                translateX = props.width - props.rightGutter;
                translateLabelX = props.width - 5;
            } else if (this.options.position === 'bottom') {
                translateX = 0;
                translateY = props.height - props.bottomGutter;
            }

            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + translateX + ', ' + translateY + ')')
                .call(axis);

            if (this.options.label) {
                svg.append('text')
                    .text(this.options.label)
                    // .attr('class', 'label')
                    .attr('style', 'font-size: ' + props.height / fontSizeDivisor + 'px')
                    .attr('fill', this.options.labelColor)
                    .attr('transform', 'translate(' + translateLabelX + ',' + (props.height - 20) + ')rotate(270)');
            }

        }
    };

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
    expose.TimeValueGraph.prototype = {
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
    };

    window.ezD3Graphs = expose;

}(d3, window));
