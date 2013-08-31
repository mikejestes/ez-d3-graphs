
    expose.ResponsiveGraph = function (el, width, height, options) {
        expose.ComboGraph.apply(this, arguments);
    };

    expose.ResponsiveGraph.prototype = extend(new expose.ComboGraph(), {
        alter: function(option, object) {
            if (option == 'svg') {
                var ratio = this.width / this.height,
                    element = d3.select(this.el)[0][0],
                    oldResize = window.onresize;

                this.width = element.offsetWidth;
                this.height = element.offsetWidth / ratio;

                object
                    .attr('width', '100%')
                    .attr('height', this.height)
                    .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
                    .attr('preserveAspectRatio', "xMidYMin")

                window.onresize = function() {
                    object.attr('height', element.offsetWidth / ratio);
                    if (oldResize) oldResize();
                };
            }
        }
    });
