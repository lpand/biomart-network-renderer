

// ============================================================================
// NOTE!!
//
// Just for now ignore renderInvalid Option!
// ============================================================================
var nt = biomart.renderer.results.network = Object.create(biomart.renderer.results.plain)

// The wrap container is a div.
// This element is created inside oldGetElement
nt.tagName = 'div'

var oldGetElement = nt.getElement

nt.getElement = function () {
        // If already present there isn't need to do anything else here
        if ($('#network-list').size())
                return $('#network-list')

        // Create the container
        var $elem = oldGetElement.call(this)
        // This is the actual tab list
        $elem.append('<ul id="network-list" class="network-tabs"></ul>')
        return $elem
}

nt._init = function () {
        this._nodes = []
        this._edges = []
        this._svg = null
        this._cache = []
        this._rowBuffer = []
        // matrix
        this._adj = []
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

function findIndex(collection, cb) {
        for (var i = 0, len = collection.length; i < len; ++i) {
                if (cb(collection[i]))
                        return i
        }
        return -1
}

nt._makeNE = function (row) {
        var nodePair = this._makeNodes(row)
        var val0Func = this.node0.value, val1Func = this.node1.value
        var node0Val = val0Func(nodePair[0]), node1Val = val1Func(nodePair[1])

        var index0 = findIndex(this._nodes, function (n) {
                return val0Func(n) === node0Val
        })
        var index1 = findIndex(this._nodes, function (n) {
                return val1Func(n) === node1Val
        })

        if (index0 < 0)
                index0 = this._nodes.push(nodePair[0]) - 1
        if (index1 < 0)
                index1 = this._nodes.push(nodePair[1]) - 1
        if (! this._adj[index0])
                this._adj[index0] = []

        this._adj[index0][index1] = 1
}

function instanceEdges (adj, nodes, edges) {
        for (var i = 0, n = adj.length; i < n; ++i) {
                if (adj[i])
                        for (var j = 0, m = adj[i].length; j < m; ++j) {
                                if (adj[i][j])
                                        edges.push({ source: i, target: j })
                        }
        }
}

// rows : array of arrays
nt.parse = function (rows, writee) {
        rows.forEach(function (row) {
                if (row[1].trim() === '') {
                        this._cache.push(row)
                } else {
                        this._cache.forEach(function (cacheRow) {
                                cacheRow[1] = row[1]
                        })

                        this._cache.push(row)

                        Array.prototype.push.apply(this._rowBuffer, this._cache)
                        this._cache = []
                }
        }, this)
}

nt.printHeader = function(header, writee) {
        this._init()
        var w = $(window).width()
        var h = $(window).height()
        var $tabsCont = writee.find('#network-list')
        var item, tabNum, svg

        tabNum = $tabsCont.children().size() + 1
        if (tabNum === 1) writee.tabs() //

        item = 'item-'+ tabNum
        // For each attribute list create a tab
        writee.tabs('add', '#'+ item, Object.keys(biomart._state.queryMart.attributes)[tabNum-1])
        // Playground for the new network
        this._svg = svg = d3.select($('#'+ item)[0])
                .append('svg:svg')
                .attr({ width: w, height: h })
                .append('g')
                .call(d3.behavior.zoom().scaleExtent([0, 20]).on('zoom', function () {
                        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")") }))
                .append('g')

        svg.append("rect")
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .attr("width", w)
                .attr("height", h);

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
        var config = biomart.networkRendererConfig

        this._drawNetwork(config)

        this._init()
        $.publish('network.completed')
}

function initPosition (nodes, width, height) {
        nodes.forEach(function (node) {
                node.x = Math.random() * width
                node.y = Math.random() * height
        })
}

nt._drawNetwork = function (config) {
        var w = $(window).width()
        var h = $(window).height()
        var clusterParams
        var graph
        var force
        var drag
        var text
        var drawText = 'text' in config
        var self = this

        config.graph['id'] = function (d) {
                var node = null
                if (self.node0.key in d)
                        node = 'node0'
                else node = 'node1'

                return self[node].value(d)
        }

        config.force.size = [w, h]

        for (var i = 0, nLen = this._rowBuffer.length; i < nLen; ++i)
                this._makeNE(this._rowBuffer[i])

        this._rowBuffer = []
        instanceEdges(this._adj, this._nodes, this._edges)

        graph = makeGraph(this._svg, this._nodes, this._edges, config.graph)
        initPosition(this._nodes, w, h)
        clusterParams = {
                adj: this._adj,
                bubbles: graph.bubbles,
                links: graph.links,
                config: config,
                hubIndexes: hubIndexes(this._edges)
        }

        if (drawText) {
                config.text.text = config.graph['id']
                text = makeText(this._svg, this._nodes, config.text)
        }

        // `cluster` defines the right force configuration: e.g. charge, tick
        cluster(clusterParams)

        // Now we can create the force layout. This actually starts the symulation.
        force = makeForce(this._nodes, this._edges, config.force)

        resize(function () {
                if (self._svg && !self._svg.empty()) {
                        self._svg.attr({
                                width: w,
                                height: h
                        })
                        force.size([w, h])
                }
        })

        // Make the simulation in background and then draw on the screen
        force.start()
        console.time('simulation ticks')
        for (var safe = 0; safe < 2000 && force.alpha() > config.force.threshold; ++safe)
                force.tick()
        console.timeEnd('simulation ticks')

        graph.bubbles
                .attr('transform', function (d) {
                        // d.x = Math.max(r, Math.min(width - r, d.x))
                        // d.y = Math.max(r, Math.min(height - r, d.y))
                        return 'translate(' + d.x + ',' + d.y + ')'
                })

        graph.links
                .attr({
                        x1: function(d) { return d.source.x },
                        y1: function(d) { return d.source.y },
                        x2: function(d) { return d.target.x },
                        y2: function(d) { return d.target.y }
                })

        if (drawText) {
                text.attr('transform', function (d) {
                        return 'translate('+ (d.x + 5) +','+ d.y +')'
                })
        }

        // drag = force.drag().on('dragstart', function (d) { return d.fixed = true })
        // graph.bubbles.call(drag)
}

nt.clear = function () {
        console.log('network-renderer#clear: not implemented yet.')
}

nt.destroy = function () {
        if (this._svg) {
                d3.select(this._svg.node().nearestViewportElement).remove()
        }
        this._nodes = this._edges = this._svg = this._rowBuffer = this._cache = this._adj = null
}
