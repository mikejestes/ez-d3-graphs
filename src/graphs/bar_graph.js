
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
