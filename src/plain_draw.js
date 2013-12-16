
function nwtDraw() {
    "use strict"

    var nodes = this.nodes, edges = this.edges, conf = this.config,
        lines = null, circles = null, group = this.group, text = "text" in conf,
        neighbors = null, force = null, neighbors = null,
        extent = d3.extent(edges, function (e) {
            return e.value
        }),
        draw = {
            force: nwtGetForce,
            newForce: nwtForce,
            draw: nwtDraw,
            lines: nwtLines,
            circles: nwtCircles,
            tick: nwtTickFn,
            computeThickness: nwtComputeThickness,
            filter: nwtFilter,
            setPosition: nwtSetPosition,
            neighbors: nwtNeighbors,
            text: nwtText
        }

    // compute neighbors
    // this.getNeighbors(0)
    // neighbors = this.neighbors

    // function signHubs() {
    //     nodes.forEach(function (n) {

    //     })
    // }

    function nwtFilter(cutoff) {
        var n = []
        edges = edges.filter(function (e) {
            if (e.value >= cutoff) {
                n.push(e.source, e.target)
                return true
            }
            return false
        })

        for (var i = 0; i < n.length; ++i) {
            for (var j = i + 1; j < n.length; ++j) {
                if (n[i] === n[j]) {
                    n.splice(j, 1);
                    --j
                }
            }
            n[i].index = i
        }

        nodes = n

        return draw
    }

    function nwtGetForce() {
        return force
    }

    function nwtForce(size) {
        return d3.layout.force()
            .nodes(nodes)
            .links(edges)
            .gravity(0.01)
            .linkDistance(150)
            .size(size)
    }

    function nwtDraw() {
        var size = [$(window).width(), $(window).height()]
        draw.filter(extent[1] / 5)
        draw.setPosition([size[0]/2, size[1]/2])
        draw.computeThickness()
        force = draw.newForce(size)
        lines = draw.lines()
        circles = draw.circles()
        if (text) {
            text = draw.text()
        }
        force.on("tick", draw.tick()).start()
        return draw
    }

    function nwtLines() {
        var g = conf.graph
        var lines = group.append("svg:g").selectAll("line")
            .data(edges).enter()
            .append("svg:line")
            .attr({
                x1: function (d) { return d.source.x },
                x2: function (d) { return d.target.x },
                y1: function (d) { return d.source.y },
                y2: function (d) { return d.target.y },
                "class": g.edgeClassName,
                "stroke-width": function (d) {
                    return d.value
                },
                "opacity": 0.8
            })
        return lines
    }

    function nwtCircles() {
        var g = conf.graph

        var circles = group.append("svg:g")
            .selectAll("g")
            .data(nodes).enter()
            .append("svg:g")

        circles.append("svg:circle")
            .attr({
                "class": g.nodeClassName,
                "r": g.radius,
                "id": g["id"],
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
        return circles
    }

    function nwtText() {
        return makeText(group, nodes, conf.text)
    }

    function nwtComputeThickness() {
        var diff = extent[1] - extent[0]

        edges.forEach(function (e) {
            e.value = (e.value - extent[0]) / diff * 11 + 1
        })

        return draw
    }

    function nwtSetPosition(centre) {
        var inner = 200, outer = 300, r, mpi = Math.PI/180,
            dist = 360/nodes.length * mpi, pos = dist
        nodes.forEach(function (d, i) {
            if (draw.neighbors(i).length > 4) r = inner
            else r = outer
            d.x = centre[0] + r * Math.cos(pos)
            d.y = centre[1] + r * Math.sin(pos)
            pos += dist
        })
    }

    function nwtNeighbors(idx) {
        if (!neighbors) {
            var n = nodes.length
            var m = edges.length
            neighbors = new Array(n)
            for (var j = 0; j < n; ++j) {
                neighbors[j] = []
            }
            for (j = 0; j < m; ++j) {
                var o = edges[j]
                neighbors[o.source.index].push(o.target);
                neighbors[o.target.index].push(o.source);
            }
        }
        return neighbors[idx]
    }

    function nwtTickFn () {
        // 1.. tick with text
        var cb0 = function () {
            circles
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')'
                })

            lines
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
            circles
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')'
                })

            lines
                .attr({
                    x1: function(d) { return d.source.x },
                    y1: function(d) { return d.source.y },
                    x2: function(d) { return d.target.x },
                    y2: function(d) { return d.target.y }
                })
        },

        callback = cb1

        circles
            .attr('transform', function (d) {
                // d.fixed = true
                // d3.select(this).style('fill', d3.rgb(d.color).darker(d.weight/3))
                return 'translate(' + d.x + ',' + d.y + ')'
            })

        lines
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


    // function scroll() {
    //     var dispatch = d3.dispatch("scroll"), hLength = 300, min = 0, max = 1
    //         vLength = 16, diff = 1, xPad = 20, yPad = 20, sc = {},
    //         scGroup = group.append("svg:g").attr("id", "scroll")

    //     function scDraw() {
    //         scGroup.selectAll("line.vscroll")
    //             .data([0, hLength]).enter()
    //             .append("svg:line")
    //             .attr({
    //                 x1: function (d) {
    //                     return d + xPad
    //                 },
    //                 y1: yPad - vLength / 2,
    //                 x2: x1: function (d) {
    //                     return d + xPad
    //                 },
    //                 y2: vLength / 2 + yPad,
    //                 "stroke-width": 2,
    //                 "stroke": "#333"
    //             })

    //         scGroup.append("svg:line")
    //             .attr({
    //                 x1: xPad, y1: yPad,
    //                 x2: xPad + hLength, y2: yPad,
    //                 "stroke-width": 5,
    //                 "stroke": "#ff0"
    //             })
    //     }

    //     scGroup
    //         // .data({ x: xPad + hLength/2, y: yPad }).enter()
    //         .append("svg:path")
    //         .attr("transform", function(d) {
    //             return "translate(" + x(d.x) + "," + y(d.y) + ")"
    //         })
    //         .attr("d", d3.svg.symbol())
    // }

    // function x(pos) {
    //     return xPax + currentX
    // }

    // function y(pos) {
    //     return yPad
    // }

    return draw
}