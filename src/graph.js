/**
 * @param config - Object configuration for the graph only
**/
function makeGraph (svg, nodes, edges, config) {
    // Draw the graph chart without positioning the elements, and return
    // bubbles and links: { bubbles: ..., links: ... }
    var graphChart = Graph(svg, nodes, edges, config)
    graphChart.bubbles.on('mouseover', function () {
            this.__radius__ || (this.__radius__ = +this.getAttribute('r'))
            d3.select(this)
                .transition()
                .attr('r', this.__radius__ * 2) })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .attr('r', this.__radius__)
        })

    return graphChart
}
