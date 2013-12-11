
function getTickFn (graph, text) {
    // 1.. tick with text
    var cb0 = function () {
        graph.bubbles
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')'
            })

        graph.links
            .attr({
                x1: function(d) { return d.source.x },
                y1: function(d) { return d.source.y },
                x2: function(d) { return d.target.x },
                y2: function(d) { return d.target.y }
            })

        text.attr('transform', function (d) {
            return 'translate('+ (d.x + 5) +','+ d.y +')'
        })
    },

    // 1.. tick without text
    cb1 = function () {
        graph.bubbles
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')'
            })

        graph.links
            .attr({
                x1: function(d) { return d.source.x },
                y1: function(d) { return d.source.y },
                x2: function(d) { return d.target.x },
                y2: function(d) { return d.target.y }
            })
    },

    callback = cb1

    graph.bubbles
        .attr('transform', function (d) {
            d.fixed = true
            d3.select(this).style('fill', d3.rgb(d.color).darker(d.weight/3))
            return 'translate(' + d.x + ',' + d.y + ')'
        })

    graph.links
        .attr({
            x1: function(d) { return d.source.x },
            y1: function(d) { return d.source.y },
            x2: function(d) { return d.target.x },
            y2: function(d) { return d.target.y }
        })

    if (text) {
        text.attr('transform', function (d) {
            return 'translate('+ (d.x + 5) +','+ d.y +')'
        })

        callback = cb0
    }

    return callback
}

function showNetwork (struct) {
    setEventHandlers(struct)
    var n = struct.renderer.nodes[0], size = struct.force.size(),
    m = [size[0] / 2, size[1] / 2]
    struct.renderer.group.attr("transform", "translate("+(m[0] - n.x)+","+(m[1] - n.y)+")")
}

function setEventHandlers(struct) {
    var fn = getTickFn(struct.graph, struct.text)
    struct.force.on('tick', function () { fn() })

    var drag = struct.force.drag().on('dragstart', function (d) {
        struct.force.stop()
        d3.event.sourceEvent.stopPropagation()
        d.fixed = true
    })
    struct.graph.bubbles.call(drag)
}

function endSimulation (struct) {
    console.timeEnd('simulation ticks')
    struct.force.stop()
    showNetwork(struct)
}

function initPosition (nodes, width, height) {
    nodes.forEach(function (node) {
        node.x = Math.random() * width
        node.y = Math.random() * height
    })
}

var NetworkRenderer = BaseNetworkRenderer.extend({

    config: biomart.networkRendererConfig,

    init: function () {
        BaseNetworkRenderer.prototype.init.call(this)
        this.tabSelector = '#network-list'
        this.group = null
    },

    getElement: function () {
        // If already present there isn't need to do anything else here
        if ($(this.tabSelector).size())
            return $(this.tabSelector)

        // Create the container
        var $elem = BaseNetworkRenderer.prototype.getElement.call(this)
        // This is the actual tab list
        $elem.append('<ul id="network-list" class="network-tabs"></ul>')
        return $elem
    },

    findElem: function (collection, idName) {
        var c = collection
        for (var n = null, i = 0, len = c.length; i < len; ++i) {
            if (idName === (n = c[i])._id)
                return n
        }
        return null
    },

    insertNodes: function (row, header) {
        var n0 = this.findElem(this.nodes, row[0]),
            n1 = this.findElem(this.nodes, row[1]), index
        if (! n0) {
            index = this.nodes.push(n0 = this.addProp({}, header[0], row[0])) - 1
            this.addProp(n0, 'index', index)
            this.addId(n0, row[0])
        }
        if (! n1) {
            index = this.nodes.push(n1 = this.addProp({}, header[1], row[1])) - 1
            this.addProp(n1, 'index', index)
            this.addId(n1, row[1])
        }
        n0.radius = 'radius' in n0 ? n0.radius + 3 : 3
        n1.radius = 'radius' in n1 ? n1.radius + 3 : 3

        return [n0, n1]
    },

    addId: function (o, idValue) {
        this.addProp(o, '_id', idValue)
    },

    // I'm assuming there could not be duplicated edges and
    // nodes.length === 2
    insertEdges: function (nodes, row, header) {
        // ids are strings here
        var _id = nodes[0]._id + nodes[1]._id,
            e = this.findElem(this.edges, _id),
            edge

        if (! e) {
            edge = {
                _id: _id,
                source: nodes[0],
                target: nodes[1],
                value: row[2]
            }
            this.edges.push(edge)
        }

        return [edge]
    },

    printHeader: function (header, writee) {
        this.init()
        BaseNetworkRenderer.prototype.printHeader.call(this, header, writee)
    },

    draw: function (writee) {
        var t = "", attrs = Object.keys(biomart._state.queryMart.attributes)
        attrs.forEach(function(a) { t += a + " " })
        this.group = this.newSVG({
            container: this.newTab(writee, $(this.tabSelector), t)[0],
            w: "100%",
            h: "100%",
            className: "network-wrapper"
        })

        this.makeNE(this.rowBuffer)
        this.rowBuffer = []
        this.canvas = nwtDraw.call(this).draw()
        // this.drawNetwork(this.config)
        // Reset the status for the next draw (tab)
        // this.init()

        $.publish('network.completed')
    },

    onResize: function (force) {
        var w = $(window).width(), h = $(window).height()
        if (this.group && !this.group.empty()) {
            this.group.attr({
                width: w,
                height: h
            })
            force.size([w, h])
        }
    },

    clustering: function (struct) {
        struct.wk = 0.5
        cluster(struct)
    },

    drawNetwork: function (config) {
        var w = $(window).width(), h = $(window).height(),
            drawText = 'text' in config, self = this,
            struct = { config: config, renderer: this }

        config.force.size = [w, h]

        this.makeNE(this.rowBuffer)
        this.rowBuffer = []
        struct.graph = makeGraph(this.group, this.nodes, this.edges, config.graph)
        struct.hubs = hubs(this.edges, this.nodes)
        initPosition(this.nodes, w, h)

        if (drawText) {
            config.text.text = config.graph['id']
            struct.text = makeText(this.group, this.nodes, config.text)
        }

        // `cluster` defines the right force configuration: e.g. charge, tick
        // TODO: NOTE: This is a temporary solution, find a better one!
        this.clustering(struct)
        // Now we can create the force layout. This actually starts the symulation.
        struct.force = makeForce(this.nodes, this.edges, config.force)
        resize(function () { self.onResize.call(self, struct.force) })

        function loop (thr, iter) {
            var t
            if (iter < 1000 && struct.force.alpha() > thr) {
                struct.force.tick()
                t = setTimeout(function () { loop(thr, ++iter) }, 1)
                self.addTimer(t)
            } else {
                endSimulation(struct)
            }
        }

        // Make the simulation in background and then draw on the screen
        struct.force.start()
        console.time('simulation ticks')
        loop(config.force.threshold, 0)
    },

    clear: function () {
        BaseNetworkRenderer.prototype.clear.call(this)
        this.clearTimers()
        if (this.group) {
            d3.select(this.group.node().nearestViewportElement).remove()
        }
        this.group = null
    },

    destroy: function () {
        this.clear()
    },

    addTimer: function (t) {
        this.timers || (this.timers = [])
        this.timers.push(t)
    },

    clearTimers: function () {
        this.timers && this.timers.forEach(function (t) {
                clearTimeout(t)
        })
        this.timers = []
    }

})

NetworkRenderer.extend = extend

biomart.renderer.results.network = new NetworkRenderer()
