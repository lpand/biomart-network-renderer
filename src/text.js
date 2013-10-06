function textCallback (_, config) {
        var keys = ['font-family', 'font-size', 'stroke', 'stroke-width', 'text-anchor']
        var attrs = {}
        keys.forEach(function (k) {
                if (k in config)
                        this[k] = config[k]
        }, attrs)

        if ('className' in config)
                attrs['class'] = config.className

        // `this` will be the selection this cb is invoked on
        var textGroup = this.append('svg:g')

        // This could be improved returning a different func
        // chosen by the doubleLayer param
        if (config.doubleLayer) {
                textGroup.append('svg:text')
                        .attr(attrs)
                        .attr('class', config.doubleLayer.className)
                        .text(config.text)
        }

        textGroup.append('svg:text')
                .attr(attrs)
                .text(config.text)
}

function hyperlinks (svg, data, config) {
        var update = svg.selectAll('a')
                .data(data)

        var a = update.enter()
                .append('svg:a')
                .attr({
                        'xlink:href': config.link,
                        target: '_blank'
                })

        if (config.callback)
                a.call(config.callback, config)

        update.exit().remove()

        return a
}
