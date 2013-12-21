
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
            var max = this.max;
            if (this.options.tickFormat) {
                max = this.options.tickFormat(max);
            }

            if (this.options.position === 'left') {
                width = 30 + max.toString().length * 8;
            } else if (this.options.position === 'right') {
                width = 10 + max.toString().length * 7.5;
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
                translateLabelX = 20 - props.leftGutter;
            } else if (this.options.position === 'right') {
                translateX = props.width - props.rightGutter;
                translateLabelX = props.rightGutter;
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
