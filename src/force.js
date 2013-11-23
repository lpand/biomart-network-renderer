// ## Force
//
// *    nodes  - `Array`
// *    edges  - `Array`
// *    config - `Object`
//              *       size
//              *       gravity
//              *       linkDistance
//              *       charge
//              *       tick
//
var Force = (function (d3) {

    "use strict";

    function make (nodes, edges, config) {
        var force = d3.layout.force()
            .nodes(nodes)
            .links(edges)
            .size(config.size)
            .theta(config.theta || 2)
            .gravity(config.gravity)
            .linkDistance(config.linkDistance) // px
            // .linkStrength(cs.linkStrength)
            .charge(config.charge)

        force.on("tick", config.tick)

        return force
    }

    return make

})(d3);

function makeForce (nodes, edges, config) {
    // Create the layout and place the bubbles and links.
    return Force(nodes, edges, config)
}