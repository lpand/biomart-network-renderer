var assert = chai.assert

describe("cluster methods", function () {

    var ren, header, rows, nodes, edges

    beforeEach(function () {
        ren = new BaseNetworkRenderer()
        nodes = [
            {g0:"a", _id:"a", index: 0},
            {g1:"b", _id:"b", index: 1},
            {g1:"c", _id:"c", index: 2}
        ]
        edges = [
            { _id: nodes[0]._id+nodes[1]._id,
                source: nodes[0], target: nodes[1], weight: "0.4"},
            { _id: nodes[1]._id+nodes[2]._id,
                source: nodes[1], target: nodes[2], weight: "0.3"},
        ]
        ren.nodes = nodes; ren.edges = edges
    })

    describe("searchColor()", function () {
        beforeEach(function () {
            ren.init()
            ren.nodes = nodes
            ren.edges = edges
        })
        it ("returns null if no reachable node has a color", function () {
            assert.isNull(searchColor(ren, nodes[0]), "no color found")
        })
        it ("returns the node's color if it already has one", function () {
            nodes[1].color = "red"
            assert.equal(searchColor(ren, nodes[1]), "red", "returns the right color")
        })
        // Let's say "b" is a hub
        it ("returns the color of the first reachable node", function () {
            nodes[1].color = "red"
            assert.equal(searchColor(ren, nodes[0]), "red")
            assert.equal(searchColor(ren, nodes[2]), "red")
        })
    })
})