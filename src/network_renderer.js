
// ============================================================================
// NOTE!!
//
// Just for now ignore renderInvalid Option!
// ============================================================================
var nt = biomart.renderer.results.network = Object.create(biomart.renderer.results.plain)

nt._init = function () {
        this._nodes = []
        this._edges = []
        this._svg = this._visualization = null
}

// row: array of fields
nt._makeNodes = function (row) {
        var n0 = {}, n1 = {}
        var col0 = row[0], col1 = row[1]
        var k0 = this.node0.key, k1 = this.node1.key
        // If it's a link
        if (col0.indexOf('<a') >= 0) {
                col0 = $(col0)
                n0[k0] = col0.text()
                n0._link = col0.attr('href')
        } else {
                n0[k0] = col0
        }

        if (col1.indexOf('<a') >= 0) {
                col1 = $(col1)
                n1[k1] = col1.text()
                n1._link = col1.attr('href')
        } else {
                n1[k1] = col1
        }

        return [n0, n1]
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
        this._init()
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

function noDraw(svg) {
        if (svg && 'empty' in svg)
                return svg.empty()
        return true
}

nt.draw = function (writee) {
        // Use body because the container is too small now
        var w = $(window).width()
        var h = $(window).height()

        if (noDraw(this._svg)) {
                // writee should be a jQuery object        
                this._svg = d3.select(writee[0])
                        .append('svg:svg')
                        .attr({
                                width: w,
                                height: h,
                                'id': 'network-svg' })

                resize(resizeHandler.bind(this))
        }

        var config = biomart.networkRendererConfig
        var self = this
        config.text.text = config.graph['id'] = function (d) {
                var node = null
                if (self.node0.key in d)
                        node = 'node0'
                else node = 'node1'

                return self[node].value(d)
        }
        config.force.size = [w, h]
                
        this._visualization = graph(this._svg, this._nodes, this._edges, config)
}

nt.clear = function () {
        // Should I delete them?
        // this._nodes = []
        // this._edges = []
        // // this.header = this.node0 = this.node1 = null
        // if (this._svg) this._svg.remove()
        // this._svg = null
        // this._visualization = null
}

nt.destroy = function () {
        // this.clear()
        if (!noDraw(this._svg)) this._svg.remove()
        this._nodes = this._edges = this._svg = this._visualization = null
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
