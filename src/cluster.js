function tick2 (attrs) {
        var config = attrs.config
        var bubbles = attrs.bubbles
        var links = attrs.links
        var hubIdx = attrs.hubIndexes
        var adj = attrs.adj
        var nodes = bubbles.data()
        var maxDomain = 20000
        var colorScale = d3.scale.linear().domain([0, maxDomain]).range(['#ff0000', '#00ffff'])
        var width = config.force.size[0]
        var height = config.force.size[1]
        var hubFromColor = {}
        var maxRadius = typeof config.graph.radius === 'number'
                ? config.graph.radius
                : d3.max(bubbles.data(), config.graph.radius)

        // BFS
        function searchColor(root, adj, nodes) {
                var queue = [root], q, len, qAdj, i, a
                while (queue.length) {
                        q = queue.pop()
                        q._visited = true
                        i = nodes.indexOf(q)
                        // edges out of q
                        if (adj[i]) {
                                qAdj = adj[i]
                        } else {
                                // edges in q
                                qAdj = []
                                for (var j = 0; j < adj.length; ++j) {
                                        if (adj[j] && adj[j][i])
                                                qAdj[j] = 1
                                }
                        }
                        for (a = 0, len = qAdj.length; a < len; ++a) {
                                if (qAdj[a] && 'color' in nodes[a]) {
                                        q.color = nodes[a].color
                                        break
                                } else {
                                        if (!('_visited' in nodes[a]) && queue.indexOf(a) < 0)
                                                queue.push(a)
                                }
                        }
                }
                // If no color was given, assign random color.
                // With the current hub selection algorithm, this can happen when there
                // are strongly connected components with few edges.
                if (!('color' in root)) {
                        markHub(root)
                        hubIdx.push(nodes.indexOf(root))
                }
        }

        function markHub (node) {
                var color = colorScale(Math.random() * maxDomain)
                node.color = color
                node.isHub = true
                hubFromColor[color] = node
        }

        hubIdx.forEach(function (idx) {
                markHub(nodes[idx])
        })

        // Give colors to nodes based on clusters
        nodes.forEach(function (node) {
                searchColor(node, adj, nodes)
        })

        // Modified version of http://bl.ocks.org/mbostock/1748247
        // Move d to be adjacent to the cluster node.
        function clusterHelper(alpha) {
                return function(d) {
                        var l, r, x, y, k = 1.5, node = hubFromColor[d.color]

                        // For cluster nodes, apply custom gravity.
                        if (d === node) {
                                node = {x: width / 2, y: height / 2, radius: -d.radius}
                                k = .5 * Math.sqrt(d.radius)
                        }

                        // I need them gt zero or they'll have the same value while deciding the bubble position.
                        // Same position causes problems with further recomputation of this func.
                        // if ((x = d.x - node.x) < 0) x = node.x - d.x
                        // if ((y = d.y - node.y) < 0) y = node.y - d.y
                        x = d.x - node.x
                        y = d.y - node.y
                        // distance between this node and the hub
                        l = Math.sqrt(x * x + y * y)
                        r = node.radius + d.radius //('radius' in node ? node.radius : radius)
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
                        var r = d.radius + maxRadius + padding
                        var nx1 = d.x - r
                        var nx2 = d.x + r
                        var ny1 = d.y - r
                        var ny2 = d.y + r
                        quadtree.visit(function(quad, x1, y1, x2, y2) {
                                if (quad.point && (quad.point !== d)) {
                                        var x = d.x - quad.point.x
                                        var y = d.y - quad.point.y
                                        var l = Math.sqrt(x * x + y * y)
                                        var r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding
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

        return function(evt) {
                bubbles
                        .each(clusterHelper(10 * evt.alpha * evt.alpha))
                        .each(collide(.5))
        }
}

/**
 * @param config - Object must have properties for the configuration of `graph`, `force`
**/
// adj, bubbles, links, config
function cluster (attrs) {
        attrs.config.force.tick = tick2(attrs)
}

function hubIndexes(edges) {
        var freq = [], m, hubIdxs = []
        var degs = function (edge) {
                freq[edge.source] = freq[edge.source] ? freq[edge.source] + 1 : 1
                freq[edge.target] = freq[edge.target] ? freq[edge.target] + 1 : 1
        }

        edges.forEach(degs)
        m = d3.quantile(freq.slice(0).sort(), 0.999)
        freq.forEach(function (f, i) {
                if (f > m)
                        hubIdxs.push(i)
        })

        return hubIdxs
}

