biomart.enrichmentRendererConfig = {
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
                linkDistance: 0,
                charge: 0,
                gravity: 0, // 0.175
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

