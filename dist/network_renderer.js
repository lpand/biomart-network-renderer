
;(function () {
        "use strict";

        biomart.networkRendererConfig = {
                graphConfig: {
                        nodeClassName: 'network-bubble',
                        edgeClassName: 'network-edge',
                        radius: 10,
                        color: function(d) { return '#bcbd22' },
                        id: function (d, i) { return 'node' + i }
                },

                forceConfig: {
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

                textConfig: {
                        'font-family': 'serif',
                        'font-size': '1em',
                        'stroke': '#ff0000',
                        'text-anchor': 'start',
                        'text': function (d, i) {
                            return 'node'+ i },
                        'doubleLayer': { 'className': 'network-shadow' }
                }
        }


}) ()

;(function (_, d3) {

"use strict";

// ============================================================================
// NOTE!!
//
// Just for now ignore renderInvalid Option!
// ============================================================================

var nt = biomart.renderer.results.network = Object.create(biomart.renderer.results.plain)

nt._nodes = []
nt._edges = []

// row: array of fields
nt._makeNodes = function (row) {
        var n1 = {}, n2 = {}

        n1[this.node0.key] = row[0]
        n2[this.node1.key] = row[1]

        return [n1, n2]
}

nt._makeNE = function (row) {
        var nodePair = this._makeNodes(row)

        // Before pushing check if nodes are already in the list
        var checkListNode0 = _.pluck(this._nodes, this.node0.key)
        var checkListNode1 = _.pluck(this._nodes, this.node1.key)
        // Look printHeader()
        var alreadyPresent0 = checkListNode0.indexOf(this.node0.value(nodePair[0]))
        var alreadyPresent1 = checkListNode0.indexOf(this.node1.value(nodePair[1]))

        // If one of them is not in the node list
        if (alreadyPresent0 < 0) {
                this._nodes.push(nodePair[0])
        }
        if (alreadyPresent1 < 0) {
                this._nodes.push(nodePair[1])
        }

        // Because it could not be a repeated record
        this._edges.push({ source: alreadyPresent0 < 0 ? nodePair[0] : this._nodes[alreadyPresent0],
                           target: alreadyPresent1 < 0 ? nodePair[1] : this._nodes[alreadyPresent1] })
}

// results.network.tagName ?
// rows : array of arrays
nt.parse = function (rows, writee) {
        for (var i = 0, rLen = rows.length; i < rLen; ++i)
                this._makeNE(rows[i])
}

// Intercept the header
nt.printHeader = function(header, writee) {
        this.header = header
        this.header.forEach(function (nodeId, idx) {
                this['node'+idx] = {
                        key: nodeId,
                        value: function (nodeObj) {
                                return nodeObj[nodeId]
                        }
                }
        }, this)
}


nt.draw = function (writee) {
        // writee should be a jQuery object
        this._svg = d3.select(writee[0])
                .append('svg:svg')
                .attr({
                        width: 700,
                        height: 600,
                        'id': 'network-svg' })
                .append('svg:g')
                .attr('id', 'network-group')

        var config = biomart.networkRendererConfig
        config.graphConfig.width = writee.width()
        config.graphConfig.height = writee.height()
        config.forceConfig.size = [
                config.graphConfig.width,
                config.graphConfig.height
        ]
                
        d3.BiomartVisualization.Network.make(this._svg,
                                             this._nodes,
                                             this._edges,
                                             config)
}

nt.clear = function () {
        // Should I delete them?
        this._nodes = []
        this._edges = []
        this.header = this.node0 = this.node1 = null
        this._svg.remove()
        this._svg = null
}

nt.destroy = function () {
        this.clear()
        this._nodes = this._edges = null
}

// nt._makeNodes = function (row) {
//         return this.schema.nodes.map(function (node) {
//                 var o = {}, attrIdxs = node.attrIdxs, idx
//                 for (var i = 0, len = attrIdxs.length; i < len; ++i) {
//                         idx = attrIdxs[i]
//                         o[this.header[idx]] = row[idx]
//                 }
//                 return o
//         }, this)
// }
// {
//         nodes: [
//                 {
//                         // indexes of columns that belong to this node
//                         attrIdxs: []
//                 },
//                 ...
//         ]
// }


}) (_, d3) // underscore.js