function centrePic(self) {
    var n = self.nodes[0], size = self.force.size(),
    m = [size[0] / 2, size[1] / 2]
    self.group.attr("transform", "translate("+(m[0] - n.x)+","+(m[1] - n.y)+")")
}

/**
 * Places elements along a circle perimenter at equal distance from each other.
 *
 * @param {Array.<Object>} nodes - elements on which set coordinates.
 * @param {Number} r - the radius of the circumference.
 * @param {Array.<Number>} centre - the centre of the circle, default the origin.
 */
function placeAlongFullCircle(nodes, r, centre) {
    if (!centre) centre = [0, 0]
    var k = nodes.length, mpi = Math.PI/180, dist = 360/k * mpi, pos = dist,
        offset = 20
    nodes.forEach(function(d, i) {
        d.x = centre[0] + r * Math.cos(pos) + (-offset + Math.random() * 2 * offset)
        d.y = centre[1] + r * Math.sin(pos) + (-offset + Math.random() * 2 * offset)
        pos += dist
    })
}

function placeAlongCircle(nodes, r, centre) {
    if (!centre) centre = [0, 0]
    var k = nodes.length, mpi = Math.PI/180, dist = 360/k * mpi, pos = dist,
        offset = 20
    nodes.forEach(function(d, i) {
        // d.x = centre[0] + r * Math.cos(pos) + (-offset + Math.random() * 2 * offset)
        d.x = centre[0] + r * Math.cos(i / k * Math.PI) //+ (-offset + Math.random() * 2 * offset)
        d.y = centre[1] + r * Math.sin(i / k * Math.PI) //+ (-offset + Math.random() * 2 * offset)
        // pos += dist
    })
}

/**
 * It returns a tick function for the "tick" event of force layout.
 * @param nodes
 * @param {String} selector
 * @return {Function} the tick function.
 */
function fociTick (nodes, circles, lines, text, self) {
    return function (e) {
        // Push nodes toward their designated focus.
        var k = .1 * e.alpha;
        nodes.forEach(function(o, i) {
            if (o.isHub) return;
            self.getNeighbors(i).forEach(function(h) {
                var x = h.x - o.x
                var y = h.y - o.y
                var l = Math.sqrt(x * x + y * y)
                if (l < 100) {
                    o.y += y * k;
                    o.x += x * k;
                }
            })
        })

        circles
            .attr("transform", function (d) {
                return "translate("+d.x+","+d.y+")"
            })
            // .attr("cx", function(d) { return d.x; })
            // .attr("cy", function(d) { return d.y; });

        lines
            .attr({
                x1: function(d) { return d.source.x },
                y1: function(d) { return d.source.y },
                x2: function(d) { return d.target.x },
                y2: function(d) { return d.target.y }
            })

        if (text) {
            text.attr('transform', function (d) {
                return 'translate('+ (d.x + 5) +','+ (d.y + 5) +')'
            })
        }
    }
}

function fociForce(nodes, size) {
    return d3.layout.force()
        .nodes(nodes)
        .links([])
        .gravity(0)
        .size(size)
}

function computeRadius(nodes, header) {
    var score = header[1]
    var max = nodes[nodes.length-1][score]
    var min = nodes[0][score]
    var diff = max - min
    nodes.forEach(function (n) {
        n.radius = (1 - (n[score] - min) / diff) * 50 + 10
    })
}

function fociDraw() {
    var w = $(window).width(), h = $(window).height()
    // this.nodes = this.nodes.filter(function (n) {
    //     return !n.isHub || (hubCount++ < 5)
    // })
    var hubs = this.nodes.filter(function (d) {
            return d.isHub
        }),
        genes = this.nodes.filter(function(d) {
            return !d.isHub
        }),
        colorScale = null

    placeAlongFullCircle(genes, 230, [w/2, h/2])
    placeAlongFullCircle(hubs, 100, [w/2, h/2])
    computeRadius(hubs, this.header)

    // colorScale = d3.scale.linear()
    //     .domain([this.nodes[this.nodes.length-1].radius,
    //             this.nodes[0].radius])
    //     .range(["#169BF9", "#ff0000"])

    colorScale = d3.scale.category20()

    var self = this, g = self.config.graph,
        lines = self.group.append("svg:g").selectAll("line")
            .data(this.edges).enter()
            .append("svg:line")
            .attr({
                x1: function (d) { return d.source.x },
                x2: function (d) { return d.target.x },
                y1: function (d) { return d.source.y },
                y2: function (d) { return d.target.y },
                "class": this.config.graph.edgeClassName
            }),
        circles = self.group.append("svg:g")
            .selectAll("g")
            .data(self.nodes).enter()
            .append("svg:g"),
        tick = null, text = null

        this.force = fociForce(this.nodes, [w, h])

        circles.append("svg:circle")
            .attr({
                "class": g.nodeClassName,
                "r": g.radius,
                "id": g["id"],
                "fill": function (d, i) {
                    return d.color = d.isHub
                        ? colorScale(d.radius)
                        : "#8D6D8D"
                },
                "stroke": "#352118",
                "stroke-width": 2,
                "opacity": 0.8
                // cx: function (d) { return d.x },
                // cy: function (d) { return d.y }
            })
        circles.append("svg:circle")
            .attr({
                "r": 2,
                "fill": "black"
            })

        if ("text" in this.config)
            text = makeText(this.group, this.nodes, this.config.text)
        tick = fociTick(this.nodes, circles, lines, text, this)

    this.force.on("tick", tick).start()
    // loop(this.config.force.threshold, this, function(self) {
    //     self.force.stop()
    //     centrePic(self)
    //     var drag = self.force.drag().on('dragstart', function (d) {
    //         self.force.stop()
    //         d3.event.sourceEvent.stopPropagation()
    //         d.fixed = true
    //     })
    //     var g = self.config.graph
    //     self.group.selectAll("circle")
    //         .data(self.nodes).enter()
    //         .append("svg:circle")
    //         .attr({
    //             "class": g.nodeClassName,
    //             "r": g.radius,
    //             "id": g["id"],
    //             // cx: function (d) { return d.x },
    //             // cy: function (d) { return d.y }
    //         })
    //         // .call(drag)
    // })
}

function loop (thr, self, cb) {
    var t
    if (self.force.alpha() > thr) {
        self.force.tick()
        t = setTimeout(function () { loop(thr, self, cb) }, 1)
        self.addTimer(t)
    } else {
        cb(self)
    }
}