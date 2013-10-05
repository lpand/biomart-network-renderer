function graph (svg, nodes, edges, config) {
        var network = d3.BiomartVisualization.Network
        // Draw the graph chart without positioning the elements, and return
        // bubbles and links: { bubbles: ..., links: ... }
        var graphChart = network.Graph(svg, nodes, edges, config.graph)
        graphChart.bubbles.on('mouseover', function () {
                d3.select(this)
                        .transition()
                        .attr('r', r * 2) })
                .on('mouseout', function () {
                        d3.select(this)
                                .transition()
                                .attr('r', config.graph.radius)
                })

        var text

        if (config.text) {
                text = hyperlinks(svg, nodes, config.text).selectAll('g')
        }

        var r = typeof config.graph.radius === 'number'
                ? config.graph.radius
                : d3.max(nodes, config.graph.radius)

        // Layout configuration
        config.force.tick = function() {
                var forceSize = force.size()

                graphChart.links.attr({
                        x1: function(d) { return d.source.x },
                        y1: function(d) { return d.source.y },
                        x2: function(d) { return d.target.x },
                        y2: function(d) { return d.target.y } })

                graphChart.bubbles
                        .attr('transform', function (d) {
                                d.x = Math.max(r, Math.min(forceSize[0] - r, d.x))
                                d.y = Math.max(r, Math.min(forceSize[1] - r, d.y))
                                return 'translate(' + d.x + ',' + d.y + ')' })

                config.text && text.attr('transform', function (d) {
                        return 'translate('+ (d.x + 10) +','+ d.y +')' })
        }

        function dragstart (d) {
                d.fixed = true
        }

        // Create the layout and place the bubbles and links.
        var force = network.Force(nodes, edges, config.force)

        var drag = force.drag().on('dragstart', dragstart)

        graphChart.bubbles.call(drag)

        setTimeout(function () {
                force.stop()
                graphChart.bubbles.data().forEach(function (d) { d.fixed = true })
        }, 5000)

        return {
                graph: graphChart,
                force: force,
                text: text
        }
}


function hyperlinks (svg, data, config) {
        var update = svg.selectAll('a')
                .data(data)

        var a = update.enter()
                .append('svg:a')
                .attr({
                        'xlink:href': config.link,
                        target: '_blank'
                })

        if (config.callback)
                a.call(config.callback, config)

        update.exit().remove()

        return a
}

// function appendText () {
//         this.each(function (d, i) {
//                 // `this` is a group
//                 var shadow = document.createElementNS('http://www.w3.org/2000/svg', 'text')
//                 var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
//                 shadow.setAttribute('class', 'network-shadow')
//                 this.appendChild(shadow)
//                 this.appendChild(text)
//         })
// }

