biomart.networkRendererConfig = {
        graph: {
                nodeClassName: 'network-bubble',
                edgeClassName: 'network-edge',
                radius: 11
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
                gravity: 0.06, // 0.175
                threshold: 0.008
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
biomart.networkRendererConfig.force.charge = 0
biomart.networkRendererConfig.force.gravity = 0
