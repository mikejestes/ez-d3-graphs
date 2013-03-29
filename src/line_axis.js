
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
