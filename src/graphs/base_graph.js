
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
