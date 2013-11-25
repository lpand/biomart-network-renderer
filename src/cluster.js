var maxDomain = 20000
var d3colorScale = null
var hubFromColor = null
var hubNodes = null
var padding = null
var maxRadius = null
var width = null
var height = null
var config = null
var nodes = null
var wk = null

/**
 * Using the BFS visit, find the value of the color property of the first node
 * reachable that has it.
 *
 * @param {BaseNetworkRenderer} renderer - renderer on which do the search.
 * @param {Object} root - node from which starts the search.
 * @return {String|null} the value of the color property or null if no node
 * reachable from root has a color defined.
 */
function searchColor(renderer, root) {
    var queue = [root], q, adj, nidx, anode

    while(queue.length) {
        q = queue.pop()
        q._visited = true
        nidx = renderer.nodes.indexOf(q)
        adj = renderer.getNeighbors(nidx)
        for (var n = 0, len = adj.length; n < len; ++n) if ('color' in (anode = adj[n])) {
                return anode.color
            } else if (!('_visited' in anode) && queue.indexOf(anode) < 0) {
                queue.push(anode)
            }
    }

    // No color found for this node (a hub?)
    return null;
}

function colorScale(n) {
    d3colorScale || (d3colorScale = d3.scale.linear().domain([0, maxDomain]).range(['#ff0000', '#00ffff']))
    return d3colorScale(n)
}

function markHub (node) {
    var color = colorScale(Math.random() * maxDomain)
    node.color = color
    node.isHub = true
    hubFromColor[color] = node
}

// Modified version of http://bl.ocks.org/mbostock/1748247
// Move d to be adjacent to the cluster node.
function clusterHelper(alpha) {
    return function(d) {
        var l, r, x, y, k = 1.5, node = hubFromColor[d.color]

        // For cluster nodes, apply custom gravity.
        if (d === node) {
            node = {x: width / 2, y: height / 2, radius: -d.radius}
            k = wk * Math.sqrt(d.radius)
        }

        // I need them gt zero or they'll have the same value while deciding the bubble position.
        // Same position causes problems with further recomputation of this func.
        // if ((x = d.x - node.x) < 0) x = node.x - d.x
        // if ((y = d.y - node.y) < 0) y = node.y - d.y
        x = d.x - node.x
        y = d.y - node.y
        // distance between this node and the hub
        l = Math.sqrt(x * x + y * y)
        r = 2 * (node.radius + d.radius) //('radius' in node ? node.radius : radius)
        // if distance !== from sum of the two radius, that is, if they aren't touching
        if (l != r) {
            l = (l - r) / l * alpha * k
            // move this node towards the hub of some amount
            d.x -= x *= l
            d.y -= y *= l
            node.x += x
            node.y += y
        }
    }
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes)
    var padding = config.force.cluster.padding
    return function(d) {
        var r = 2 * (d.radius + maxRadius) + padding
        var nx1 = d.x - r
        var nx2 = d.x + r
        var ny1 = d.y - r
        var ny2 = d.y + r
        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x
                var y = d.y - quad.point.y
                var l = Math.sqrt(x * x + y * y)
                var r = 2 * (d.radius + quad.point.radius) + (d.color !== quad.point.color) * padding + padding
                if (l < r) {
                    l = (l - r) / l * alpha
                    d.x -= x *= l
                    d.y -= y *= l
                    quad.point.x += x
                    quad.point.y += y
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
        })
    }
}

function tick2 (attrs) {
    var renderer = attrs.renderer, bubbles = attrs.graph.bubbles,
        links = attrs.graph.links

    wk = attrs.wk
    config = attrs.config
    nodes = bubbles.data()
    width = config.force.size[0]
    height = config.force.size[1]
    padding = config.force.cluster.padding
    hubFromColor = {}
    hubNodes = attrs.hubs
    maxRadius = typeof config.graph.radius === 'number'
        ? config.graph.radius
        : d3.max(nodes, config.graph.radius)

    hubNodes.forEach(function (h) {
        markHub(h)
    })

    // Give colors to nodes based on clusters
    nodes.forEach(function (node) {
        if ((node.color = searchColor(renderer, node)) === null) {
            // If no color was given, assign random color.
            // With the current hub selection algorithm, this can happen when there
            // are strongly connected components with few edges.
            markHub(node)
            hubNodes.push(node)
        }
    })

    return function(evt) {
        bubbles
            .each(clusterHelper(10 * evt.alpha * evt.alpha))
            .each(collide(0.5))
    }
}

function cluster (attrs) {
    attrs.config.force.tick = tick2(attrs)
}


function hubs(edges, nodes) {
    var freq = [], m, hubs = []
    var degs = function (edge) {
        freq[edge.source] = freq[edge.source] ? freq[edge.source] + 1 : 1
        freq[edge.target] = freq[edge.target] ? freq[edge.target] + 1 : 1
    }

    edges.forEach(degs)
    m = d3.quantile(freq.slice(0).sort(), 0.98)
    freq.forEach(function (f, i) {
        if (f >= m)
            hubs.push(nodes[i])
    })

    return hubs
}

