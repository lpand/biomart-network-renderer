function textCallback (_, config) {
        var attrs = {
                'font-family': config['font-family'],
                'font-size': config['font-size'],
                'stroke': config.stroke,
                'fill': config.fill,
                'text-anchor': config['text-anchor']
        }

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


biomart.networkRendererConfig = {
        graph: {
                nodeClassName: 'network-bubble',
                edgeClassName: 'network-edge',
                radius: 10,
                color: function(d) { return '#0A6AF7' }
        },

        force: {
                linkDistance: function(link) {
                        // return link.source.weight + link.target.weight > 8 ? 200 : 100
                        if (link.source.weight > 4 ^ link.target.weight > 4)
                            return 150
                        if (link.source.weight > 4 && link.target.weight > 4)
                            return 350
                        return 100
                },
                charge: -500,
                gravity: 0.06, // default 0.1
        },

        text: {
                'font-family': 'serif',
                'font-size': '1em',
                'stroke': '#ff0000',
                'text-anchor': 'start',
                'doubleLayer': { 'className': 'network-shadow' },
                callback: textCallback,
                link: function (d) {
                        return d._link
                }
        }
}
