// NETWORK
biomart.networkRendererConfig = {
    graph: {
        nodeClassName: 'network-bubble',
        edgeClassName: 'network-edge',
        radius: function (d) {
            return 20//5 + d.radius
        },
        "id": function (d) {
            return d._id
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
        gravity: 0.01, // 0.175
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
    return d.isHub ? 4 * d.weight : -2 * d.weigth
}

// ENRICHMENT
biomart.enrichmentRendererConfig = {
    graph: {
        nodeClassName: function (d) {
            return "isHub" in d ? "annotation-bubble" : "network-bubble"
        },
        edgeClassName: 'network-edge',
        radius: function (d) {
            return 5 + d.radius
        },
        'id': function (d) {
            return d._id
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
        },
        text: function (d) {
            return d._id
        }
    }
}


