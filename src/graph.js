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



// function makeNetwork (svg, nodes, edges, config) {

//         var drag = force.drag().on('dragstart', dragstart)

//         graphChart.bubbles.call(drag)

//         setTimeout(function () {
//                 force.stop()
//                 graphChart.bubbles.data().forEach(function (d) { d.fixed = true })
//         }, 1e4)

//         return {
//                 graph: graphChart,
//                 force: force,
//                 text: text
//         }
// }