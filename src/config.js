
;(function () {
        "use strict";

        biomart.networkRendererConfig = {
                graph: {
                        nodeClassName: 'network-bubble',
                        edgeClassName: 'network-edge',
                        radius: 10,
                        color: function(d) { return '#bcbd22' }
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
                        'doubleLayer': { 'className': 'network-shadow' }
                }
        }


}) ()
