;(function () {

"use strict"

var nt = biomart.renderer.results.network = Object.create(biomart.renderer.results.plain)

nt._nodes = []
nt._edges = []

nt._makeNodes = function (row) {
        return this.schema.nodes.map(function (node) {
                var o = {}, attrIdxs = node.attrIdxs, idx
                for (var i = 0, len = attrIdxs.length; i < len; ++i) {
                        idx = attrIdxs[i]
                        o[this.header[idx]] = row[idx]
                }
                return o
        }, this)
}

nt._makeNE = function (row) {
        var nodePair = this._makeNodes(row)

        Array.prototype.push.apply(this._nodes, nodePair)
        this._edges.push({ source: nodePair[0], target: nodePair[1] })
}

// results.network.tagName ?
nt.parse = function (rows, writee) {
        for (var i = 0, rLen = rows.length; i < rLen; ++i)
                this._makeNE(rows[i])
}

// Intercept the header
nt.printHeader = function(header, writee) {
        this.header = header
        // {
        //         nodes: [
        //                 {
        //                         // indexes of columns that belong to this node
        //                         attrIdxs: []
        //                 },
        //                 ...
        //         ]
        // }
}


nt.draw = function (writee) {
        // Should be a jQuery object
        var container = writee[0]

}

nt.clear = function () {
        // Should I delete them?
        this._nodes = []
        this._edges = []
        this.header = null
        // graph.remove()
}

nt.destroy = function () {
        // svg.remove()
        this.clear()
        this.schema = null
}

}) ()