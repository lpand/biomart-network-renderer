// ## Graph
//
// *    svg     - `Object` d3 selection of an svg.
// *    nodes   - `Array`  Of objects.
// *    edges   - `Array`  Of objects of the form `{ source: a, target: b }`. Where `a` and `b` ara integers.
//      See [d3.force.links()](https://github.com/mbostock/d3/wiki/Force-Layout#wiki-links).
// *    config  - `Object` Containes the configuration for the graph.
//      *       radius: bubble's radius
//      *       nodeClassName - Optional: class for a bubble
//      *       fill - Optional : color for a bubble
//      *       edgeClassName - Optional: class for a link
//
//
// All the attributes are d3 style: value or callback(d, i).
var Graph = (function (d3) {

        "use strict";

        function makeLines(svg, edges, config) {
                // Update
                var update = svg.selectAll('line')
                        .data(edges)

                var attrs = {}

                if ('edgeClassName' in config)
                        attrs['class'] = config.edgeClassName

                // Enter
                var lines = update.enter()
                        .append('svg:line')
                        .attr(attrs)

                // Exit
                update.exit()
                        .remove()

                return lines
        }

        // A group with a circle and a text for each data.
        function makeBubbles(svg, nodes, config) {
                var update = svg.selectAll('circle')
                        .data(nodes)

                update.exit()
                        .remove()

                var attrs = { r: config.radius }

                if ('fill' in config)
                        attrs.fill = config.fill
                if (config.hasOwnProperty('id'))
                        attrs['id'] = config['id']
                if ('nodeClassName' in config)
                        attrs['class'] = config.nodeClassName

                var bubbles = update.enter()
                        .append('svg:circle')
                        .attr(attrs)

                return bubbles
        }

        function graph (svg, nodes, edges, config) {
                var group = svg
                if ('groupId' in config) {
                        group = d3.select('#'+config.groupId).empty()
                                ? svg.append('svg:g')
                                : d3.select('#'+config.groupId)
                        group.attr('id', config.groupId)
                }
                return {
                        links: makeLines(group, edges, config),
                        bubbles: makeBubbles(group, nodes, config)
                }
        }

        return graph

})(d3);