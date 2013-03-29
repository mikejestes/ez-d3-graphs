
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
