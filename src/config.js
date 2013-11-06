biomart.networkRendererConfig = {
        graph: {
                nodeClassName: 'network-bubble',
                edgeClassName: 'network-edge',
                radius: function (d) {
                        return 5 + d.radius
                },
                'id': function (d) {
                        return d._key
                }
        },

        force: {
                linkDistance: function(link) {
                        // return link.source.weight + link.target.weight > 8 ? 200 : 100
                        if (link.source.weight > 4 ^ link.target.weight > 4)
                            return 100
                        if (link.source.weight > 4 && link.target.weight > 4)
                            return 200
                        return 50
                },
                charge: -300,
                gravity: 0.1, // 0.175
                threshold: 0.005,
                cluster: {
                        padding: 60
                }
        },

        text: {
                className: 'network-text',
                'doubleLayer': { 'className': 'network-shadow' },
                callback: textCallback,
                link: function (d) {
                        return d._link
                }
        }
}

// biomart.networkRendererConfig.force.linkDistance = 20
biomart.networkRendererConfig.force.charge = function (d) {
        // return d.isHub ? 10 * d.weight * d.x/1000 : -10 * d.weight * d.x/1000
        return d.isHub ? -5 * d.weight : -300 * d.weigth
}

