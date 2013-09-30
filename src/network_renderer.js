;(function (d3) {

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
        var node0Value = this.node0.value(nodePair[0])
        var node1Value = this.node1.value(nodePair[1])
        var alreadyPresent0 = null
        var alreadyPresent1 = null

        this._nodes.some(function (node) {
                if (this.node0.value(node) === node0Value) {
                        alreadyPresent0 = node
                        return true
                }
        }, this)

        this._nodes.some(function (node) {
                if (this.node1.value(node) === node1Value) {
                        alreadyPresent1 = node
                        return true
                }
        }, this)

        // If one of them is not in the node list
        if (!alreadyPresent0) {
                this._nodes.push(nodePair[0])
        }
        if (!alreadyPresent1) {
                this._nodes.push(nodePair[1])
        }

        // Because it could not be a repeated record
        this._edges.push({ source: alreadyPresent0 || nodePair[0],
                           target: alreadyPresent1 || nodePair[1] })
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
        // this.header = this.node0 = this.node1 = null
        if (this._svg) this._svg.remove()
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


})(d3); // underscore.js